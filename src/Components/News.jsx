import React, { useEffect } from 'react'
import Weather from './Weather'
import Calender from './Calender'
import './News.css'
import userImg from '../assets/Images/user.jpg'
import NoImg from '../assets/Images/no-img.png'
import BlogImg1 from '../assets/Images/blog1.jpg'
import BlogImg2 from '../assets/Images/blog2.jpg'
import BlogImg3 from '../assets/Images/blog3.jpg'
import BlogImg4 from '../assets/Images/blog4.jpg'
import axios from 'axios'
import { useState } from 'react'
import NewsModal from './NewsModal'
import Bookmarks from './Bookmarks'
import BlogsModal from './BlogsModal'

const categories = ["general", "world", "business", "technology", "entertainment", "sports", "science", "health", "nation"]

const News = ({onShowBlogs, blogs, onEditBlog, onDeleteBlog}) => {
  const [headline, setHeadline] = useState(null)
  const [news, setNews] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [showBookmarksModal, setShowBookmarksModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showBlogModal, setShowBlogModal] = useState(false)

  useEffect(()=>{
    const fetchNews = async() => {
      let url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&apikey=b5601d01002b54fb24ef50a22fe51ce8`
      // let url = `https://newsapi.org/v2/everything?q=${selectedCategory}&lang=en&apiKey=879171c6a5634a1084a62c4451a3ae4f`



      if(searchQuery) {
        url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&apikey=b5601d01002b54fb24ef50a22fe51ce8`
      // url = `https://newsapi.org/v2/everything?q=${searchQuery}&lang=en&apiKey=879171c6a5634a1084a62c4451a3ae4f`
      }

      const response = await axios.get(url)
      const fetchedNews = response.data.articles

      fetchedNews.forEach((article) => {
        if(!article.image){
          article.image = NoImg
        }
      })

      setHeadline(fetchedNews[0])
      setNews(fetchedNews.slice(1,7))

      const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || []
      setBookmarks(savedBookmarks)

      console.log(news);
    }
    fetchNews()
  }, [selectedCategory, searchQuery])

  const handleCategoryClick = (e, category) => {
    e.preventDefault(
      setSelectedCategory(category)
    )
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setSearchInput("")
  }

  const handleArticleClick = (article) =>{
    setSelectedArticle(article)
    setShowModal(true)

    console.log(article)
  }

  const handleBookmarkClick = (article) =>{
    setBookmarks((prevBookmarks) => {
      const updatedBookmarks = prevBookmarks.find((bookmark) => bookmark.title === article.title) ? prevBookmarks.filter((bookmark) => bookmark.title !== article.title) : [...prevBookmarks, article]
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks))
      return updatedBookmarks
    })
  }

  const handleBlogClick = (blog) =>{
    setSelectedPost(blog)
    setShowBlogModal(true)
  }

  const closeBlogModal = () => {
    setShowBlogModal(false)
    selectedPost(null)
  }

  return (
    <div className="news">
      <header className="news-header">
        <h1 className="logo">News & Blogs</h1>
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="search news..." 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      </header>
      <div className="news-content">
        <div className="navbar">
          <div className="user" onClick={onShowBlogs}>
            <img src={userImg} alt="User Image" />
            <p>Mary's Blog</p>
          </div>
          <nav className="categories">
            <h1 className="nav-heading">Categories</h1>
            <div className="nav-links">
              {categories.map((category)=>(
                <a href="#" 
                  key={category} 
                  className="nav-link"
                  onClick={(e)=>handleCategoryClick(e,category)}
                >{category}</a>
              ))}
              <a href="#" className="nav-link" onClick={()=> setShowBookmarksModal(true)}>Bookmarks 
                <i className="fa-solid fa-bookmark"></i>
              </a>
            </div>
          </nav>
        </div>
        <div className="news-section">
          {headline && ( 
            <div className="headline" onClick={() => handleArticleClick(headline)}>
             <img src={headline.image || NoImg} alt={headline.title} />
              <h2 className="headline-title">
                {headline.title}
                <i className={`${bookmarks.some((bookmark) => bookmark.title === headline.title) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`} onClick={(e)=>{
                  e.stopPropagation()
                  handleBookmarkClick(headline)
                }}></i>
              </h2>
            </div>
          )}
         
          <div className="news-grid">
            {news.map((article, index) => ( 
              <div key={index} className="news-grid-item"  onClick={() => handleArticleClick(article)}>
               <img src={article.image || NoImg} alt={article.title} />
               <h3>
                 {article.title}
                 <i className={`${bookmarks.some((bookmark) => bookmark.title === article.title) ? "fa-solid" : "fa-regular"} fa-bookmark bookmark`} onClick={(e)=>{
                  e.stopPropagation()
                  handleBookmarkClick(article)
                }}></i>
               </h3>
             </div>
            ))}
          </div>
        </div>
        <NewsModal 
          show={showModal} 
          article={selectedArticle} 
          onClose={() =>setShowModal(false)}
        />
        <Bookmarks 
          show={showBookmarksModal} 
          bookmarks={bookmarks} 
          onClose={()=> setShowBookmarksModal(false)} 
          onSelectArticle={handleArticleClick} 
          onDeleteBookmark={handleBookmarkClick}
        />
        <div className="my-blogs">
          <h1 className="my-blogs-heading">My Blogs</h1>
          <div className="blog-posts">
            {blogs.map((blog, index)=> (
              <div key={index} className="blog-post" onClick={() => handleBlogClick(blog)}>
                <img src={blog.image || NoImg} alt="blog.title" />
                <h3>{blog.title}</h3>
                <div className="post-buttons">
                  <button className="edit-post" onClick={()=> onEditBlog(blog)}>
                    <i className="bx bxs-edit"></i>
                  </button>
                  <button className="delete-post" onClick={(e) =>{
                    e.stopPropagation()
                    onDeleteBlog(blog)
                  } }>
                    <i className="bx bxs-x-circle"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedPost && showBlogModal && (
             <BlogsModal show={showBlogModal} blog={selectedPost}  onClose={closeBlogModal}/>
          )}
         
        </div>
        <div className="weather-calender">
          <Weather/>
          <Calender/>
        </div>
      </div>
      <footer className="news-footer">
        <p>
          <span>News & Blogs App</span>
        </p>
        <p>
          &copy; All Right Reserved, By Code with Anslem
        </p>
      </footer>
    </div>
  )
}

export default News