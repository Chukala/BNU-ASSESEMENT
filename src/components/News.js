import React, { Component } from 'react';
import Parser from 'rss-parser';
import SingleNews from './SingleNews'
import feeds from '../feeds.json';


class News extends Component {
    constructor(){
        super();
        this.state = {
          allNews: [],
          sortedNews: [],
          topTenNews: []
        }
        this.getNews = this.getNews.bind(this)
    }
    
    componentDidMount(){
       this.getNews()
    }

    /** sorting by recent date */
    topTenSortedNews = (sortedNewsArray) => {
        let topTenNews = []
        for (let i = 0; i < 10; i++) {
            const topTen = sortedNewsArray[i]; 
            topTenNews.push(topTen)
        }
        return topTenNews
    }
     
    /** do to the CORS security policy it was difficult to fetch the data from my browser and it tookes me 
     * time to figure out and I found in rss-parser documentation to use this proxy link
     * If you are running in the same network with the server may be it doesn't need the CORS_PROXY
     */

    async getNews(){
        try {
           const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
           let urls = feeds
           let newsFeeds = urls.feeds
           const parser = new Parser();
           let items =[];
           for(let i = 0; i < newsFeeds.length; i++){
               const url = newsFeeds[i];
               const feed = await parser.parseURL(CORS_PROXY + url);
               await Promise.all(feed.items.map(async (currentItem) => {
                   if(items.filter((item) => item === currentItem.length) <=1){
                       items.push(currentItem)
                   }
               }));
               /** sort each item based on pubished date  and stored in sorted array*/
                 let sortedItems = items.sort((a, b) => b.pubDate - a.pubDate)
               /** set the state of all fetched items object, sorted array and top ten news returned from 
                * top Ten sorted news function
                */
               this.setState({
                allNews: items,
                sortedNews: sortedItems,
                topTenNews: this.topTenSortedNews(sortedItems)
              })
           } 
            
        } catch (error) {
            console.log(error.message)
        }
    }
    
    render() {
        /** display only the top ten news */
        const displayNews = this.state.topTenNews.map((news,i) => {
            return <SingleNews news={news} key={i} />
        })
              
        return (
            <div className="container">
                <ol>{displayNews}</ol>
            </div>
        )
    }
}

export default News;
