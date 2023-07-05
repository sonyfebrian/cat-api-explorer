import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Rating from "./Rating";

const Card = () => {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const totalPages = 7;

  //handle search
  const handleSearch = (event) => {
    const keyword = event.target.value.trim();
    setSearch(keyword);
    setDetail(null);

    if (keyword !== "") {
      const filteredCats = data.filter((cat) =>
        Object.values(cat).some((value) =>
          value.toString().toLowerCase().includes(keyword.toLowerCase())
        )
      );
      setSearchResults(filteredCats);
    } else {
      setSearchResults([]);
    }
  };

  // GET DATA
  const getData = useCallback(() => {
    setLoading(true);
    axios
      .get(`https://api.thecatapi.com/v1/breeds?page=${page}&limit=10`)
      .then((response) => {
        const newData = response.data.map((item) => ({
          id: uuidv4(),
          name: item.name,
          child_friendly: item.child_friendly,
          dog_friendly: item.dog_friendly,
          stranger_friendly: item.stranger_friendly,
          origin: item.origin,
          description: item.description,
        }));
        setData((prevData) => [...prevData, ...newData]);
        setLoading(false);
        setPage((prevPage) => prevPage + 1);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    if (page <= totalPages) {
      getData();
    }
  }, [getData, page, totalPages]);

  //handle scroll when user scroll to bottom
  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (
      scrollTop + windowHeight >= scrollHeight &&
      !loading &&
      page <= totalPages
    ) {
      getData();
    }
  }, [getData, loading, page, totalPages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  //details button
  const handleToggleDetails = (catId) => {
    if (detail === catId) {
      setDetail(null);
    } else {
      setDetail(catId);
    }
  };
  return (
    <>
      <div className="sticky top-0 bg-indigo-500 text-indigo-50">
        <header>
          <div className="flex justify-center p-5">
            {" "}
            <div className="relative text-gray-600 focus-within:text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button
                  type="submit"
                  className="p-1 focus:outline-none focus:shadow-outline"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </span>
              <input
                type="search"
                value={search}
                onChange={handleSearch}
                className="py-2 text-sm text-white bg-white rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                placeholder="Search..."
              />
            </div>
          </div>
        </header>
      </div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {searchResults.length === 0
              ? data.map((cat) => (
                  <>
                    {" "}
                    <div className="p-4 lg:w-1/3" key={cat.id}>
                      <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg  text-center ">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                          {cat.origin}
                        </h2>
                        <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                          {cat.name}
                        </h1>
                        <div className="flex border-t border-gray-200 pt-2">
                          <span className="text-gray-500">Child Friendly</span>
                          <span className="ml-auto text-gray-900">
                            <Rating value={cat.child_friendly} />
                          </span>
                        </div>
                        <div className="flex border-t border-gray-200 pt-2">
                          <span className="text-gray-500">Dog Friendly</span>
                          <span className="ml-auto text-gray-900">
                            {" "}
                            <Rating value={cat.dog_friendly} />
                          </span>
                        </div>
                        <div className="flex border-t border-b mb-6 border-gray-200 pt-2">
                          <span className="text-gray-500">
                            Stranger Friendly
                          </span>
                          <span className="ml-auto text-gray-900">
                            {" "}
                            <Rating value={cat.dog_friendly} />
                          </span>
                        </div>
                        {detail === cat.id && (
                          <div>
                            <span className="text-gray-500">Description</span>
                            <p>{cat.description}</p>
                          </div>
                        )}
                        <button
                          onClick={() => handleToggleDetails(cat.id)}
                          className="text-indigo-500 inline-flex items-center"
                        >
                          {detail === cat.id ? "Read Less" : "Read More"}
                          <svg
                            className="w-4 h-4 ml-2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ))
              : searchResults.slice(0, 10).map((cat) => (
                  <>
                    {" "}
                    <div className="p-4 lg:w-1/3" key={cat.id}>
                      <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg  text-center ">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                          {cat.origin}
                        </h2>
                        <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                          {cat.name}
                        </h1>
                        <div className="flex border-t border-gray-200 pt-2">
                          <span className="text-gray-500">Child Friendly</span>
                          <span className="ml-auto text-gray-900">
                            <Rating value={cat.child_friendly} />
                          </span>
                        </div>
                        <div className="flex border-t border-gray-200 pt-2">
                          <span className="text-gray-500">Dog Friendly</span>
                          <span className="ml-auto text-gray-900">
                            {" "}
                            <Rating value={cat.dog_friendly} />
                          </span>
                        </div>
                        <div className="flex border-t border-b mb-6 border-gray-200 pt-2">
                          <span className="text-gray-500">
                            Stranger Friendly
                          </span>
                          <span className="ml-auto text-gray-900">
                            {" "}
                            <Rating value={cat.dog_friendly} />
                          </span>
                        </div>
                        {/* {detail === cat.id && (
                          <div>
                            <p>{cat.description}</p>
                            <p>Origin: {cat.origin}</p>
                            <p>Temperament: {cat.temperament}</p>
                          </div>
                        )} */}
                        <button
                          onClick={() => handleToggleDetails(cat.id)}
                          className="text-indigo-500 inline-flex items-center"
                        >
                          {detail === cat.id ? "Read Less" : "Read More"}
                          <svg
                            className="w-4 h-4 ml-2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default Card;
