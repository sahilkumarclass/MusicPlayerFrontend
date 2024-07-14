import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SongList.css';
import { FaSearch } from 'react-icons/fa'; // Importing search icon from react-icons

const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [originalSongs, setOriginalSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [isSorting, setIsSorting] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const response = await axios.get('/api/music/songs');
            setSongs(response.data);
            setOriginalSongs(response.data);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const playSong = async (index) => {
        try {
            await axios.get(`/api/music/play/${index}`);
            setCurrentSongIndex(index);
        } catch (error) {
            console.error('Error playing song:', error);
        }
    };

    const stopSong = async () => {
        try {
            await axios.get('/api/music/stop');
            setCurrentSongIndex(null);
        } catch (error) {
            console.error('Error stopping song:', error);
        }
    };

    const togglePlayStop = async () => {
        if (currentSongIndex !== null) {
            await stopSong();
        } else {
            if (songs.length > 0) {
                await playSong(0); // Play the first song if none is playing
            }
        }
    };

    const searchSong = async () => {
        if (searchTerm) {
            try {
                const response = await axios.get(`/api/music/search/${searchTerm}`);
                alert(response.data);
            } catch (error) {
                console.error('Error searching song:', error);
            }
        }
    };

    const toggleSortSongs = async () => {
        try {
            setIsSorting(true);
            if (!isSorted) {
                const response = await axios.get('/api/music/sort');
                setTimeout(() => {
                    setSongs(response.data);
                    setIsSorted(true);
                    setIsSorting(false);
                }, 500);
            } else {
                setTimeout(() => {
                    setSongs([...originalSongs]);
                    setIsSorted(false);
                    setIsSorting(false);
                }, 500);
            }
        } catch (error) {
            console.error('Error sorting songs:', error);
        }
    };

    const nextSong = async () => {
        if (currentSongIndex !== null) {
            try {
                await axios.get(`/api/music/next/${currentSongIndex}`);
                setCurrentSongIndex((currentSongIndex + 1) % songs.length);
            } catch (error) {
                console.error('Error playing next song:', error);
            }
        }
    };

    const previousSong = async () => {
        if (currentSongIndex !== null) {
            try {
                await axios.get(`/api/music/previous/${currentSongIndex}`);
                setCurrentSongIndex(currentSongIndex - 1 >= 0 ? currentSongIndex - 1 : songs.length - 1);
            } catch (error) {
                console.error('Error playing previous song:', error);
            }
        } else {
            alert('No previous song available');
        }
    };

    return (
        <div className="container">
            <h1 className="title">Song List</h1>
            <div className="song-list-container">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search Song"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button" onClick={searchSong}>
                        <FaSearch />
                    </button>
                </div>
                <ul className={`song-list ${isSorting ? 'fade-out' : 'fade-in'}`}>
                    {songs.map((song, index) => (
                        <li key={index} className="song-item" onClick={() => playSong(index)}>
                            {song}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="controls">
                <button className="control-button" onClick={toggleSortSongs}>
                    {isSorted ? 'Original Order' : 'Sort Songs'}
                </button>
                <button className="play-stop-button" onClick={togglePlayStop}>
                    {currentSongIndex !== null ? 'Stop' : 'Play'}
                </button>
                <button className="control-button" onClick={nextSong}>Next Song</button>
                <button className="control-button" onClick={previousSong}>Previous Song</button>
            </div>
        </div>
    );
};

export default SongList;
