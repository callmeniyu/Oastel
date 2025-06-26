export default function Footer() {
  return (
    <footer className="bg-primary_green text-white px-4 pt-10 pb-2 md:pr-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        <div className="text-4xl font-bold my-auto font-poppins w-2/6 flex justify-start md:justify-center"><h1>Oastel</h1></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm md:text-base my-4 justify-center">
          <div>
            <h4 className="font-semibold text-gray-300 mb-2">About</h4>
            <ul className="space-y-1 font-medium">
              <li><a href="#">About us</a></li>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Features</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-300 mb-2">Services</h4>
            <ul className="space-y-1 font-medium">
              <li><a href="#">Tours</a></li>
              <li><a href="#">Vans</a></li>
              <li><a href="#">Stays</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-300 mb-2">Help</h4>
            <ul className="space-y-1 font-medium">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Feedback</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-300 mb-2">Others</h4>
            <ul className="space-y-1 font-medium">
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Blogs</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-xs text-gray-300 font-poppins font-medium">
        Copyright@2025 Oastel. All Rights Reserved.
      </div>
    </footer>
  );
}
