import { Link } from "react-router-dom";
import ErrorImage from "../../assets/404.svg";


const ErrorPage = () => {
    // const error = useRouteError();

  
    return (
      <div id="error-page" className="text-center mt-10 ">
       <div className="flex justify-center">
       <img src={ErrorImage} alt="" />
       </div>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
        </p>
        <Link to='/'><button className="p-2 bg-cyan-900 text-white rounded-xl mt-5"> Go back</button></Link>
        
      </div>
    );
}

export default ErrorPage;