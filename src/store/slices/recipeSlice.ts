import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// RecipeData 인터페이스 정의
export interface RecipeData {
    RCP_NM: string; // 레시피 이름
    RCP_WAY2: string; // 조리 방법
    RCP_PARTS_DTLS: string; // 재료 정보
    INFO_ENG: string; // 칼로리 정보
    ATT_FILE_NO_MAIN?: string; // 선택적 속성 (메인 이미지)
    manuals: { step: string; img?: string }[]; // 만드는 방법과 이미지 배열
}

// API 호출하여 레시피 데이터 가져오는 Thunk
export const fetchRecipe = createAsyncThunk<
    RecipeData, // Thunk의 반환 타입은 RecipeData
    string,     // 인자로 name을 전달받음
    { rejectValue: string }
>(
    'recipe/fetchRecipe',
    async (name, { rejectWithValue }) => {
        try {
            // XML 형식으로 첫 번째 API 요청
            const xmlUrl = `http://openapi.foodsafetykorea.go.kr/api/b2bbfebcd5724db6990c/COOKRCP01/xml/1/10/RCP_NM=${name}`;
            const xmlResponse = await axios.get(xmlUrl);
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlResponse.data, "application/xml");
            const totalCount = xmlDoc.getElementsByTagName("total_count")[0]?.textContent;

            // total_count가 0이면 JSON 요청을 시도
            if (totalCount === '0') {
                const jsonUrl = `http://openapi.foodsafetykorea.go.kr/api/b2bbfebcd5724db6990c/COOKRCP01/json/1/10/RCP_NM=${name}`;
                const jsonResponse = await axios.get(jsonUrl);

                if (jsonResponse.data && jsonResponse.data.COOKRCP01.row.length > 0) {
                    return jsonResponse.data.COOKRCP01.row[0]; // 첫 번째 레시피 반환
                } else {
                    return rejectWithValue('검색 결과가 없습니다.');
                }
            } else {
                const firstRow = xmlDoc.getElementsByTagName("row")[0];

                // MANUAL 데이터 추출
                const manuals = Array.from({ length: 20 }, (_, i) => {
                    const manual = firstRow.getElementsByTagName(`MANUAL${(i + 1).toString().padStart(2, '0')}`)[0]?.textContent || null;
                    const manualImg = firstRow.getElementsByTagName(`MANUAL_IMG${(i + 1).toString().padStart(2, '0')}`)[0]?.textContent || null;
                    if (manual) {
                        return { step: manual, img: manualImg || undefined };
                    }
                    return null;
                }).filter(item => item !== null); // null 값은 제거

                const parsedRecipe: RecipeData = {
                    RCP_NM: firstRow.getElementsByTagName("RCP_NM")[0]?.textContent || "",
                    RCP_WAY2: firstRow.getElementsByTagName("RCP_WAY2")[0]?.textContent || "",
                    RCP_PARTS_DTLS: firstRow.getElementsByTagName("RCP_PARTS_DTLS")[0]?.textContent || "",
                    INFO_ENG: firstRow.getElementsByTagName("INFO_ENG")[0]?.textContent || "",
                    ATT_FILE_NO_MAIN: firstRow.getElementsByTagName("ATT_FILE_NO_MAIN")[0]?.textContent || "",
                    manuals: manuals as { step: string; img?: string }[], // 직렬화 가능한 데이터로 변환
                };

                return parsedRecipe;
            }
        } catch (err) {
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue('알 수 없는 에러가 발생했습니다.');
        }
    }
);

// recipeSlice 생성
const recipeSlice = createSlice({
    name: 'recipe',
    initialState: {
        data: null as RecipeData | null, // RecipeData 타입을 명시적으로 지정
        error: null as string | null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // RecipeData 타입이므로 안전하게 처리 가능
            })
            .addCase(fetchRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Unknown error';
            });
    },
});

export default recipeSlice.reducer;
