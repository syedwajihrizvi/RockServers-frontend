import { useEffect, useRef, useState } from "react"
import Bg1 from "../assets/images/countdown-bg.webp"
import Bg2 from "../assets/images/countdown-bg-2.jpg"
import { Link } from "react-router-dom"
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import { Navbar } from "./Navbar";
import TrailerOne from "../assets/videos/trailerone.mp4"
import TrailerTwo from "../assets/videos/trailertwo.mp4"

const NumberWrapper = (
    {number, type, customClass}: 
    {number: number, type:string, customClass: string}) => {
    const numberString = number.toString()
    return (
        <div className="letter-wrapper__wrapper">
            <div className={`letter-wrapper__container letter-wrapper__container--${customClass}`}>
                <div className={`letters letters--${customClass}`}>
                    {
                        (type == "hours" || type == "seconds" || type == "minutes") && numberString.length < 2 &&
                        <div className={`letter-wrapper letter-wrapper--${customClass}`} >
                         <h1 className={`countdown__time countdown__time--${customClass}`}>0</h1>
                        </div>
                    }
                    {numberString.split('').map((letter, index) => (
                        <div key={index} className={`letter-wrapper letter-wrapper--${customClass}`} >
                            <h1 className={`countdown__time countdown__time--${customClass}`}>{letter}</h1>
                        </div>
                    ))}
                </div>
                <h1 className={`letter-wrapper__type letter-wrapper__type--${customClass}`}>{type.toUpperCase()}</h1>
            </div>
        </div>
    )
}

export const Countdown = ({displayTrailers}: {displayTrailers: boolean}) => {
  const trailerUrls = [TrailerOne, TrailerTwo]
  const bgImages = [Bg1, Bg2]
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0)
  const [timeToReleaseDate, setTimeToReleaseDate] = useState(
    {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        ready: false
    }
  )
  const gta6ReleaseDate = new Date("2026-05-26T00:00:00").getTime()
  useEffect(() => {
    const updateTime = setInterval(() => {
        const currentDate = Date.now()
        let delta= (gta6ReleaseDate - currentDate)/1000
        // calculate (and subtract) whole days
        const days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        const minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        const seconds = Math.round(delta % 60);
        setTimeToReleaseDate(prev => ({
            ...prev,
            days, hours, minutes, seconds,
            ready: true
          }))      
    }, 1000)
    return () => clearInterval(updateTime)
  })

  useEffect(() => {
    videoRef.current?.load()
  }, [currentTrailerIndex])

  return (
    <div className="countdown__container__wrapper" style={{
        backgroundImage: `url(${bgImages[currentTrailerIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: '#cccccc'
      }}>
        <div style={{position: 'fixed', top: 5, width: '100%'}}>
            <Navbar/>
        </div>
        {timeToReleaseDate.ready && <div className="countdown__container countdown__container--lg">
            <NumberWrapper number={timeToReleaseDate.days} type="days" customClass="lg"/> 
            <NumberWrapper number={timeToReleaseDate.hours} type="hours" customClass="lg"/> 
            <NumberWrapper number={timeToReleaseDate.minutes} type="minutes" customClass="lg"/> 
            <NumberWrapper number={timeToReleaseDate.seconds} type="seconds" customClass="lg"/>
        </div>}
        {!timeToReleaseDate.ready && <Dots color="white"/> }
        {displayTrailers && 
        <div className="trailers">
            <div className="trailers__buttons">
                <button className={`btn btn--md btn--pink`} onClick={() => setCurrentTrailerIndex(0)}>Trailer 1</button>
                <button className={`btn btn--md btn--blue`} onClick={() => setCurrentTrailerIndex(1)}>Trailer 2</button>
            </div>
            <video ref={videoRef} autoPlay={true} loop={true} controls={true}>
                <source src={trailerUrls[currentTrailerIndex]} type="video/mp4"/>
            </video>
        </div>}
    </div>
  )
}

export const MiniCountdown = () => {
    const [timeToReleaseDate, setTimeToReleaseDate] = useState(
        {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            ready: false
        }
      )
      const bgImages = [Bg1, Bg2]
      const [hidden, setHidden] = useState(false)
      const [currentIndex, setCurrentIndex] = useState(0)
      const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    
      const gta6ReleaseDate = new Date("2026-05-26T00:00:00").getTime()

      useEffect(() => {
        const updateTime = setInterval(() => {
            const currentDate = Date.now()
            let delta= (gta6ReleaseDate - currentDate)/1000
            const days = Math.floor(delta / 86400);
            delta -= days * 86400;
    
            const hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
    
            const minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;
    
            const seconds = Math.round(delta % 60);
            setTimeToReleaseDate({
                ...timeToReleaseDate,
                days, hours, minutes, seconds,
                ready: true
            })       
        }, 1000)
        return () => clearInterval(updateTime)
      })   
      
      useEffect(() => {
        const updateBgImage = setInterval(() => {
            setCurrentIndex(prev => (prev === 0 ? 1 : 0))
          }, 3500)
        return () => clearInterval(updateBgImage)
      }, [])

      useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }, [])
      
      return (
        <div className={`countdown--display countdown--display--${hidden ? "hidden" : "active"}`}>

            {!hidden ? (
            screenWidth > 768 ? (
                <FaChevronCircleDown className="icon icon--y" fontSize={40} onClick={() => setHidden(true)} />
            ) : (
                <FaChevronCircleRight className="icon icon--x" fontSize={40} onClick={() => setHidden(true)} />
            )
            ) : (
            screenWidth > 768 ? (
                <FaChevronCircleUp className="icon icon--y" fontSize={40} onClick={() => setHidden(false)} />
            ) : (
                <FaChevronCircleLeft className="icon icon--x" fontSize={40} onClick={() => setHidden(false)} />
            )
            )}
            <Link to="/countdown" style={{textDecoration: 'none'}}>
            <div className="countdown__container__wrapper countdown__container__wrapper--sm" style={{
                backgroundImage: `url(${bgImages[currentIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: '#cccccc',
                borderRadius: '2rem',
                overflow: 'hidden',
                opacity: hidden ? 0 : 1
            }}>
                <div className="countdown__container countdown__container--sm" style={{padding: '0.5rem'}}>
                    {!timeToReleaseDate.ready && <Dots color="white"/> }
                    {!hidden && timeToReleaseDate.ready && 
                    <>
                        <NumberWrapper number={timeToReleaseDate.days} type="days" customClass="sm"/> 
                        <NumberWrapper number={timeToReleaseDate.hours} type="hours" customClass="sm"/> 
                        <NumberWrapper number={timeToReleaseDate.minutes} type="minutes" customClass="sm"/> 
                        <NumberWrapper number={timeToReleaseDate.seconds} type="seconds" customClass="sm"/>
                    </>}
                </div>
            </div>
            </Link>
        </div>
      )
}