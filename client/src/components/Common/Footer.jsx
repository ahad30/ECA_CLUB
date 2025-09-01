import { Link } from "react-router-dom";

const Footer = () => {
  return (
        <div className='bg-black py-2 lg:py-3 text-white'>
      <div className='px-2 max-w-6xl mx-auto flex justify-center items-center'>
        <div>
          <Link to={"/"}>
            <h1 className='text-sm md:text-lg font-bold uppercase'>@copyright reserves Comment System Web App 2025</h1>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Footer