const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121C34] text-[#E0E0E0] text-center py-4 text-sm mt-auto">
      <p>&copy; {currentYear} ECA Club Management System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
