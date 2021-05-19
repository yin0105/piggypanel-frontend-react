import React from 'react';

const Footer = () => {

  return (
    <React.Fragment>
      <footer className="footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              © {new Date().getFullYear()} Veltrix<span className="d-none d-sm-inline-block"> - Cured with <i className="mdi mdi-heart text-danger"></i> by The IT Team.</span>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Footer;