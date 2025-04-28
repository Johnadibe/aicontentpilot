// "use client"

// import { useState, useEffect, useRef } from 'react';

// const adjectiveData = [
//     { text: "Amazing", gradientClass: "gradient-amazing" },
//     { text: "Powerful", gradientClass: "gradient-powerful" },
//     { text: "Engaging", gradientClass: "gradient-engaging" },
//     { text: "Effective", gradientClass: "gradient-effective" },
//     { text: "Remarkable", gradientClass: "gradient-remarkable" }
// ];

// export default function TypewriterEffect() {
//     const [displayText, setDisplayText] = useState("");
//     const [wordIndex, setWordIndex] = useState(0);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [typeSpeed, setTypeSpeed] = useState(150);

//     // Find the longest word to set container width
//     const longestWord = adjectiveData.reduce(
//         (longest, current) => current.text.length > longest.length ? current.text : longest,
//         ""
//     );

//     const currentWord = adjectiveData[wordIndex].text;
//     const currentGradient = adjectiveData[wordIndex].gradientClass;

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!isDeleting) {
//                 // Writing mode
//                 setDisplayText(currentWord.substring(0, displayText.length + 1));
//                 setTypeSpeed(100);

//                 // If we've fully written the word, pause before deleting
//                 if (displayText === currentWord) {
//                     setTypeSpeed(1000); // Pause at the end of word
//                     setIsDeleting(true);
//                 }
//             } else {
//                 // Deleting mode
//                 setDisplayText(currentWord.substring(0, displayText.length - 1));
//                 setTypeSpeed(50); // Delete faster than typing

//                 // If we've fully deleted the word, move to next word
//                 if (displayText === "") {
//                     setIsDeleting(false);
//                     setWordIndex((prev) => (prev + 1) % adjectiveData.length);
//                     setTypeSpeed(300); // Pause before starting new word
//                 }
//             }
//         }, typeSpeed);

//         return () => clearTimeout(timer);
//     }, [displayText, isDeleting, currentWord, typeSpeed]);

//     return (
//         <span className="typewriter-container inline-block relative">
//             <span
//                 className={`${currentGradient} inline-block text-left`}
//                 style={{ minWidth: `${longestWord.length}ch` }}
//             >
//                 {displayText}
//                 <span className="typing-cursor absolute">|</span>
//             </span>
//         </span>
//     );
// }
"use client"

import { useState, useEffect } from 'react';

export default function InfiniteWriter() {
    const [currentWord, setCurrentWord] = useState(0)
    const [currentText, setCurrentText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    const words = [
        { text: "Amazing", gradient: "from-purple-500 to-blue-500" },
        { text: "Powerful", gradient: "from-pink-500 to-red-500" },
        { text: "Stunning", gradient: "from-amber-500 to-orange-500" },
        { text: "Effective", gradient: "from-emerald-500 to-teal-500" },
    ]

    useEffect(() => {
        const typingSpeed = isDeleting ? 50 : 100
        const word = words[currentWord].text

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                setCurrentText(word.substring(0, currentText.length + 1))

                // If word is complete, start deleting after a pause
                if (currentText.length === word.length) {
                    setTimeout(() => setIsDeleting(true), 1500)
                }
            } else {
                // Deleting
                setCurrentText(word.substring(0, currentText.length - 1))

                // If deletion is complete, move to next word
                if (currentText.length === 0) {
                    setIsDeleting(false)
                    setCurrentWord((prev) => (prev + 1) % words.length)
                }
            }
        }, typingSpeed)

        return () => clearTimeout(timer)
    }, [currentText, currentWord, isDeleting, words])

    return (
        <span className="inline-block min-w-[180px] md:min-w-[240px] ml-[-13px] sm:ml-0">
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${words[currentWord].gradient}`}>
                {currentText}
            </span>
        </span>
    )
}
