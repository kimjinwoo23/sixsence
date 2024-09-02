import React, { useState , useEffect} from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './css/Home.css';


Modal.setAppElement('#root');

function Home() {
  
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:666/api/movie/allMovie')
      .then((res) => {
        console.log('Response data:', res.data);
        if (Array.isArray(res.data)) {
          setMovies(res.data);
        } else {
          console.error('Invalid data format:', res.data);
        }
      })
      .catch((err) => {
        console.error('API 요청 중 오류 발생:', err);
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
      });
  }, []);
  const openModalWithVideo = (url) => {
    setVideoUrl(url);
    setModalIsOpen(true);
  };

  return (
    <div className="app-container">
   
      <div className="slider-container">
        <Swiper 
        
          modules={[Navigation, Pagination, Autoplay]}
          
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 8000 }} // 슬라이드 자동 재생 시간 설정
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
          
          preventClicks={false}  // 클릭 이벤트를 방지하지 않도록 설정
          preventClicksPropagation={false}  // 클릭 이벤트 전파 방지하지 않도록 설정
        >
          <div className='slide-slider'>
           <SwiperSlide className='slide slide1' style={{height: '1000px'}}>
            <div>
              <button className='bootplay1' onClick={() => openModalWithVideo('https://youtu.be/amI9ujTxtH4?si=B9CtJDnyZGUF1Gys')}>
              <svg xmlns="http://www.w3.org/2000/svg" 
              width="100" height="1000" fill="currentColor" 
              className="bi bi-play" viewBox="0 0 16 16"
              margin="0"
              >
              
  <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
</svg>
              </button>
            </div>
          </SwiperSlide>

          <SwiperSlide className='slide slide2' style={{height: '1000px'}}>
            <div>
              <button className='bootplay2' onClick={() => openModalWithVideo('https://youtu.be/tRNv-NrjzkQ?si=fM83t59wxFsgt93P')}>
              <svg xmlns="http://www.w3.org/2000/svg" 
              width="100" height="1000" fill="currentColor" 
              className="bi bi-play" viewBox="0 0 16 16">
              
  <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
</svg>
              </button>
            </div>
          </SwiperSlide>

          <SwiperSlide className='slide slide3' style={{height: '1000px'}}>
            <div>
              <button className='bootplay3' onClick={() => openModalWithVideo('https://youtu.be/NVDLUJa5dac?si=ByoZmBY2ZvZF1xmt')}>
              <svg xmlns="http://www.w3.org/2000/svg"
               width="100" height="1000" fill="currentColor" 
               className="bi bi-play"  viewBox="0 0 16 16">
              
  <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
</svg>
              </button>
            </div>
          </SwiperSlide>

          <SwiperSlide className='slide slide4' style={{height: '1000px'}}>
            <div>
              <button className='bootplay4' onClick={() => openModalWithVideo('https://youtu.be/-rlkJCk58SY?si=vWnS4vu2e-3uH-Es')}>
              <svg xmlns="http://www.w3.org/2000/svg" 
              width="100" height="1000" fill="currentColor" 
              className="bi bi-play" viewBox="0 0 16 16">
              
  <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
</svg>
              </button>
            </div>
          </SwiperSlide>

          <SwiperSlide className='slide slide5' style={{height: '1000px'}}>
            <div>
              <button className='bootplay5' onClick={() => openModalWithVideo('https://youtu.be/xIMEESxmVec?si=emYK982CtBaag8Zw')}>
              <svg xmlns="http://www.w3.org/2000/svg" 
              width="100" height="1000" fill="currentColor" 
              className="bi bi-play" viewBox="0 0 16 16">
  <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
</svg>
              </button>
            </div>
          </SwiperSlide>
          </div>
        </Swiper>
        
      </div>


     
       <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            
            zIndex: 500,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          content: {
            zIndex: 501, // z-index 추가
            position: 'relative',
            width: '60%',
            height: 'auto',
            margin: '0 auto',
            borderRadius: '8px',
            padding: '0',
            overflow: 'hidden',
          }
        }}
      >
        <div className="video-background-container">
          <ReactPlayer
          
            url={videoUrl}
            playing={true}
            loop
            controls={true}
            muted
            width="100%"
            height="1000px"
            
              className="react-player"
          />
        </div>
        <div className="modal-button-container">
          <button className="modal-button" onClick={() => setModalIsOpen(false)}>Close</button>
        </div>
      </Modal>
      <div className="movies-container">
      <Swiper
  modules={[Navigation, Pagination]}
  spaceBetween={20}
  slidesPerView={5}
  navigation
  pagination={{ clickable: true }}
  breakpoints={{
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
    1280: { slidesPerView: 4 },
    1536: { slidesPerView: 5 }
  }}
  onInit={(swiper) => console.log('Swiper initialized:', swiper)}
>
{movies.map((movie) => (
  <SwiperSlide key={movie.movieNo} className="movie-slide">
    <div className="movie-poster-container">
      <img src={movie.movieImage} alt={movie.movieTitle} className="movie-poster" />
      <div className="movie-info-zero">
        <h3>{movie.movieTitle}</h3>
      </div>
      <div className="infomation">
        <a href={`/movie/${movie.movieNo}`} className="info_button">상세보기</a>
        {/* 예매 버튼 수정 */}
        <a href={`/Movieboard-app?movieId=${movie.movieNo}`} className="booking-button">예매하기</a>
      </div>
    </div>
  </SwiperSlide>
))}
</Swiper>
      </div>
  
    </div>
  );
}

export default Home;