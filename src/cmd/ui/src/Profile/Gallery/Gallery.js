import './Gallery.css';
import React, { useState, useEffect } from 'react';
import GalleryItem from './GalleryItem/GalleryItem'
import Pagination from './Pagination/Pagination'
import { getAudioMsgs, getVideos } from '../../Api/Api'

 function Gallery({type, unit}) {
    const [data, setData] = useState(null);
    const [startItem, setStartItem] = useState(0)

    var paginate = (pageNumber) => {
        setStartItem(4 * (pageNumber - 1));
    }

    useEffect(() => {
        if(!unit) return
        if(type === "audio") {
            getAudioMsgs(unit.ip).then(audios => {
                setData(audios)
            })
        } else if (type === "video") {
            getVideos(unit.ip).then(videos => {
                setData(videos)
            })
        }
    },[type])

    return (
        <div className="gallery-container">
            {!data || !data.length ?
            <div className="no-data-gallery-msg"> 
                <p> No data to be previewed </p> 
            </div>: 
            <> 
                <div className="items-container">
                    {
                        [...Array(Math.min(data.length - startItem, 4))].map((x, i) => 
                            <GalleryItem name= {unit.name} type={type} time={data[i + startItem].time} data={data[i]} key={i} />
                        )
                    }
                </div>
                <Pagination
                    dataSize={data.length}
                    paginate={paginate}
                />
            </>
        }
        </div>
    );
}
export default Gallery;
