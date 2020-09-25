import React from 'react'

const singleNews = (props) => {
    return (    
        <li><a href={`${props.news.link}`}>{props.news.title}</a></li>
    )
}

export default singleNews
