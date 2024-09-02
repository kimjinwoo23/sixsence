import React from 'react';
import "./css/Footer.css";
function Footer() {
  return (
    <footer className="footer">
    <div className="footer-content">
      <div className="footer-left">
        <ul className="footer-links">
          <li><a href="/moviechart" className="footer-link">영화</a></li>
          <li><a href="/Movieboard-app" className="footer-link">예매</a></li>
          <li><a href="/store" className="footer-link">스토어</a></li>
          <li><a href="/customerBoard" className="footer-link">고객센터</a></li>
        </ul>
      </div>
      <div className="footer-right">
        <ul className="footer-links">
          <li><a href='https://github.com/kimjinwoo23/Final' className="footer-link">GitHub</a></li>
          <li><a href='https://notion.com' className="footer-link">Notion</a></li>
        </ul>
      </div>
      <div className="footer-brand">
        &copy; SixSence, Final Projent
      </div>
    </div>
  </footer>
  )}
export default Footer;