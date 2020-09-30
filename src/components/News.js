import React, { Component } from 'react';
import Parser from 'rss-parser';
import SingleNews from './SingleNews'
import feeds from '../feeds.json';


class News extends Component {
    constructor(){
        super();
        this.state = {
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

    removeDuplicates = (items) => {
      return items.filter((a, b) => items.indexOf(a) === b);
    }
    
    sortItems = (items) => {
        return items.sort((a, b) => (b.pubDate - a.pubDate));
    }
    
    /** do to the CORS security policy it was difficult to fetch the data from my browser and it tookes me 
     * time to figure out and I found in rss-parser documentation to use this proxy link
     * If you are running in the same network with the server may be it doesn't need the CORS_PROXY
     */
     // async makes it always return a promis
     // allows await to be used in it
    async getNews(){
        let items = [];
        try {
           const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
           // urls array
           const urls = feeds.feeds;
            // instantiate new parser object 
           const parser = new Parser();
            //request a promise for each url and resolve a promise for all requested promise
           const feed = urls.map(url => parser.parseURL(CORS_PROXY + url));
            //resolve all promises asynchronously and filter the item is not dublicated and store on the items array for each is not asynchrounous
            await Promise.all(feed)
                .then(results => {
                    results.forEach((result) => {
                        items.push(...result.items)
                    });
                })
                .catch(err => console.log(err.reason)); 

            //removes dublicate   
            this.removeDuplicates (items);
            this.sortItems(items);
            /**set the state of all fetched items object, sorted array and 
             * top ten news returned from top Ten sorted news function */
            this.setState({
                topTenNews: this.topTenSortedNews(items)
            })                 
        } catch (err) {
            console.log(err)
        }   
        return items 
    }
    
    render() {
        //console.log(this.state.topTenNews)
        /** display only the top ten news */
        const displayNews = this.state.topTenNews.map((news,i) => {
            return <SingleNews news={news} key={i} />
        })
              
        return (
            <div className="container">
                { this.state.topTenNews.length === 0 ? 
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div> : 
                    <ol>{displayNews} </ol>
                }
                 
            </div>
        )
    }
}

export default News;
