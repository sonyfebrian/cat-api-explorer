import PropTypes from "prop-types";

const Rating = ({ value }) => {
  const filledStars = Math.floor(value);
  const emptyStars = 5 - filledStars;

  return (
    <div className="flex mb-4">
      {[...Array(filledStars)].map((_, index) => (
        <svg
          key={index}
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="w-4  text-indigo-500"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <svg
          key={index}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="w-4  text-indigo-500"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      ))}
      <span className="text-gray-600 ml-3">{value}</span>
    </div>
  );
};
Rating.propTypes = {
  value: PropTypes.number.isRequired,
};
export default Rating;
