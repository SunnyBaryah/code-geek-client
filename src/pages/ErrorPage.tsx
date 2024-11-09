import error404 from "/404-image.png";
export default function ErrorPage(){
    return(<div className="mt-10 text-white flex-col justify-center items-center">
        <div className="flex justify-center mb-10">
        <h1 className="text-5xl">Error 404!!</h1>
        </div>
        <div className="flex justify-center">
            <img className="md:w-1/2 lg:w-1/4" src={error404}/>
        </div>
        <div className="flex justify-center">
        <h2 className="text-3xl">Page not found</h2>
        </div>
    </div>)
}