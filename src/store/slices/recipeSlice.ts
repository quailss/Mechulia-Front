import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const FOOD_API_KEY = process.env.REACT_APP_RECIPE_API_KEY;
const BASE_URL = process.env.REACT_APP_API_RECIPE_BASE_URL;

// RecipeData 인터페이스 정의
export interface RecipeData {
    RCP_NM: string;
    RCP_WAY2: string; 
    RCP_PARTS_DTLS: string;
    INFO_ENG: string; 
    ATT_FILE_NO_MAIN?: string; 
    manuals: { step: string; img?: string }[];
}

// API 호출하여 레시피 데이터 가져오는 Thunk
export const fetchRecipe = createAsyncThunk<
    RecipeData, 
    string,    
    { rejectValue: string }
>(
    'recipe/fetchRecipe',
    async (name, { rejectWithValue }) => {
        try {
            // Netlify Functions을 사용해 XML 형식으로 첫 번째 API 요청
            const xmlUrl = `/.netlify/functions/fetchRecipe?endpoint=${FOOD_API_KEY}/COOKRCP01&name=${name}`;
            const xmlResponse = await axios.get(xmlUrl);

            // XML 응답 파싱
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlResponse.data, "application/xml");
            const totalCount = xmlDoc.getElementsByTagName("total_count")[0]?.textContent;

            // total_count가 0이면 JSON 요청을 시도
            if (totalCount === '0') {
                const jsonUrl = `/.netlify/functions/fetchRecipe?endpoint=${FOOD_API_KEY}/COOKRCP01/json&name=${name}`;
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
                }).filter(item => item !== null); 

                const parsedRecipe: RecipeData = {
                    RCP_NM: firstRow.getElementsByTagName("RCP_NM")[0]?.textContent || "",
                    RCP_WAY2: firstRow.getElementsByTagName("RCP_WAY2")[0]?.textContent || "",
                    RCP_PARTS_DTLS: firstRow.getElementsByTagName("RCP_PARTS_DTLS")[0]?.textContent || "",
                    INFO_ENG: firstRow.getElementsByTagName("INFO_ENG")[0]?.textContent || "",
                    ATT_FILE_NO_MAIN: firstRow.getElementsByTagName("ATT_FILE_NO_MAIN")[0]?.textContent || "",
                    manuals: manuals as { step: string; img?: string }[],
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
        data: null as RecipeData | null,
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
                state.data = action.payload; 
            })
            .addCase(fetchRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Unknown error';
            });
    },
});

export default recipeSlice.reducer;
