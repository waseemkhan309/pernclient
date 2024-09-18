import React, { useEffect, useState } from "react";
import axios from "axios";

// Sample correct answers (use your logic)
const correctAnswers = {
    0: "Yes",
    1: "No",
    2: "Yes",
    3: "Yes",
    4: "No",
};

const VerticalCarousel = ({ slides, delay = 1000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [responses, setResponses] = useState(Array(slides.length).fill(null)); // Initialize with null for each question
    const [hoveredButton, setHoveredButton] = useState(null); // Store the hovered button
    const [showModal, setShowModal] = useState(false); // Modal visibility
    const [apiResponse, setApiResponse] = useState(null); // Store the API response
    const [isLoading, setIsLoading] = useState(false); // Loading state for API call
    const [error, setError] = useState(null); // Error state for API call
    const [allResponses, setAllResponses] = useState([]); // Store all responses fetched from the API

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        const isLastSlide = currentSlide === slides.length - 1;
        if (!isLastSlide) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handleOptionClick = (reaction) => {
        // Save the user's response with both the question and the selected option
        setResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            updatedResponses[currentSlide] = {
                question: slides[currentSlide].text,
                selectedOption: reaction,
            };
            return updatedResponses;
        });

        // Add delay before moving to the next slide
        setTimeout(() => {
            nextSlide();
        }, delay);
    };

    const handleSubmit = async () => {
        const unanswered = responses.filter((response) => response === null);
        if (unanswered.length > 0) {
            alert("Please answer all questions before submitting.");
        } else {
            setIsLoading(true);
            try {
                const response = await axios.post("http://localhost:5000/api/store", responses, {
                    headers: { "Content-Type": "application/json" },
                });
                setApiResponse(response.data); // Store the API response
                setIsLoading(false);
                setShowModal(true); // Show the modal after submission
            } catch (err) {
                setError(err.message); // Handle error state
                setIsLoading(false);
                console.error("Error submitting responses:", err);
            }
        }
    };

    // Fetch all responses when the component mounts
    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/store");
                setAllResponses(res.data);
                console.log("Fetched responses:", res.data);
            } catch (err) {
                console.error("Error fetching responses:", err);
            }
        };
        fetchResponses();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setApiResponse(null); // Clear the API response
    };

    return (
        <div className="flex items-center w-full h-screen">
            {/* Fixed Dots Container */}
            <div className="absolute left-10 flex flex-col space-y-4 z-[999]">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer h-4 w-4 rounded-full border-2 ${currentSlide === index ? "bg-white" : "bg-transparent"
                            }`}
                        onClick={() => handleDotClick(index)}
                    ></div>
                ))}
            </div>

            {/* Carousel */}
            <div className="relative flex w-full h-screen overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-transform duration-700 transform ${index === currentSlide
                            ? "translate-y-0"
                            : index > currentSlide
                                ? "translate-y-full"
                                : "-translate-y-full"
                            }`}
                    >
                        <div className="flex flex-col md:flex-row bg-purple-500 w-full h-full overflow-hidden">
                            <div className="w-[50%] flex justify-center items-center pl-20">
                                <div className="flex items-center justify-center text-white text-3xl w-[70%]">
                                    {slide.text}
                                </div>
                            </div>
                            <div className="flex-1 flex items-center bg-white justify-center space-x-5">
                                {slide.reactions.map((element, i) => (
                                    <div
                                        key={i}
                                        className="relative flex flex-col items-center"
                                        onMouseEnter={() => setHoveredButton(i)}
                                        onMouseLeave={() => setHoveredButton(null)}
                                    >
                                        <button
                                            onClick={() => handleOptionClick(element)}
                                            className={`text-6xl focus:outline-none p-4 rounded-full ${responses[currentSlide]?.selectedOption === element
                                                ? "bg-purple-300"
                                                : ""
                                                }`}
                                        >
                                            {element === "Yes" ? "👍" : "👎"}
                                        </button>

                                        {/* Tooltip */}
                                        {(hoveredButton === i ||
                                            responses[currentSlide]?.selectedOption === element) && (
                                                <div className="absolute mt-28 text-lg text-gray-700 bg-gray-200 p-2 rounded-lg shadow-lg">
                                                    {element === "Yes" ? "Yes" : "No"}
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            {currentSlide === slides.length - 1 && (
                <div className="absolute bottom-10 right-10">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            )}

            {/* Modal for showing results */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[999]">
                    <div className="bg-white p-6 rounded-lg w-[50%]">
                        <h2 className="text-3xl text-purple-600 font-bold mb-4">Submit List</h2>
                        <ul>
                            {responses.map((response, index) => (
                                <li key={index} className="mb-4">
                                    <div className="flex items-center">
                                        <span className="font-bold mr-2">Q: {response.question}</span>
                                        <span className="ml-4">
                                            {response.selectedOption}{" "}
                                            {response.selectedOption === correctAnswers[index] ? (
                                                <span className="text-green-500 text-xl">✔</span>
                                            ) : (
                                                <span className="text-red-500 text-xl">✘</span>
                                            )}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerticalCarousel;
