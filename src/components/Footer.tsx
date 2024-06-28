export const Footer = () => {
  const footerNemus = [
    {icon: <i className="fa-brands fa-facebook"></i>, link: 'https://example.com/facebook'},
    {icon: <i className="fa-brands fa-linkedin"></i>, link: 'https://example.com/linkedin'},
    {icon: <i className="fa-brands fa-instagram"></i>, link: 'https://example.com/instagram'}
  ]
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          {
            footerNemus.map((menu, index) => {
              return (
                <a href={menu.link} key={index} target="_blank" rel="noopener noreferrer">
                  {menu.icon}
                </a>
              )
            })
          }
        </div>
        <div className="copyright">
          <p>&copy; 2024 Somnath Sardar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
