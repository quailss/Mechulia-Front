import React, { useEffect } from "react";
import {  useLocation } from 'react-router-dom';
import Navigation from "./components/nav";
import SearchBar from "./components/searchBar";
import "./styles/detailRestaurant.css";

const DetailRestaurant = () => {
    const location  = useLocation();
    const { place_name, place_img, x, y, address_name, road_address_name, phone, place_url  } = location.state || {};

    //지도에 해당 음식점 위치 띄우기
    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JavaScript_KEY}&autoload=false`;
        script.async = true;
        document.head.appendChild(script);
    
        script.onload = () => {
    
          const kakao: any = (window as any).kakao;
          if (kakao && kakao.maps) {
    
            // 지도 로드
            kakao.maps.load(() => {
    
              const container = document.getElementById("map");
              if (!container) {
                console.error("map 컨테이너가 존재하지 않습니다.");
                return;
              }
    
              const options = {
                center: new kakao.maps.LatLng(Number(y), Number(x)),
                level: 3,
              };
    
              console.log("지도 옵션:", options);
    
              // 지도 생성
              const map = new kakao.maps.Map(container, options);
              console.log("지도 생성 완료");
    
              // 마커 생성
              const markerPosition = new kakao.maps.LatLng(Number(y), Number(x));
              const marker = new kakao.maps.Marker({
                position: markerPosition,
              });
    
              // 마커 지도에 표시
              marker.setMap(map);

            });
          } else {
            console.error("kakao.maps 객체를 찾을 수 없습니다.");
          }
        };
    
        return () => {
          // 컴포넌트 언마운트 시 스크립트 제거
          document.head.removeChild(script);
        };
      }, [x, y]);
      

    return(
        <div>
            <Navigation />
            <div className="searchbar-fix">
                <SearchBar /> 
            </div>
            <div className="detail-restaurant">
                <div className="restaurant-image">
                    {place_img && <img src={decodeURIComponent(place_img)} alt={place_name} />} 
                </div>

                <div className="restaurant-detail-container">
                    <h1>{place_name}</h1>
                    <div className="restaurant-phone">
                        <h2>번호</h2>
                        <p>{phone}</p>
                    </div>
                    <div className="restaurant-address">
                        <h2>주소</h2>
                        <p>지번주소: {address_name}</p>
                        <p>도로명주소: {road_address_name}</p>
                    </div>
                    <div className="restaurant-link">
                        {place_url && (
                            <a href={place_url} target="_blank" rel="noopener noreferrer">
                            자세히 보기
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div id="map" style={{ width: '100%', height: '400px', marginTop: '60px' }}></div>
            <footer className="footer-detailRestaurant"></footer>
        </div>
        
    );
};

export default DetailRestaurant;