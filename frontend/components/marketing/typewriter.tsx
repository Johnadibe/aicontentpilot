"use client"

import { useState, useEffect, useMemo } from "react"

interface TypewriterProps {
    words: string[]
    typingSpeed?: number
    deletingSpeed?: number
    delayBetweenWords?: number
    className?: string
}

export function Typewriter({
    words,
    typingSpeed = 100,
    deletingSpeed = 50,
    delayBetweenWords = 1500,
    className = "",
}: TypewriterProps) {
    const [text, setText] = useState("")
    const [wordIndex, setWordIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    // Calculate the width of the container based on the longest word
    const containerWidth = useMemo(() => {
        const longestWord = words.reduce((longest, word) => (word.length > longest.length ? word : longest), "")
        return `${longestWord.length}ch`
    }, [words])

    useEffect(() => {
        const currentWord = words[wordIndex]

        const timer = setTimeout(
            () => {
                setText((prev) => {
                    if (isDeleting) {
                        // Delete a character
                        return prev.substring(0, prev.length - 1)
                    } else {
                        // Add a character
                        return currentWord.substring(0, prev.length + 1)
                    }
                })

                if (!isDeleting && text === currentWord) {
                    // Start deleting after a delay
                    setTimeout(() => setIsDeleting(true), delayBetweenWords)
                } else if (isDeleting && text === "") {
                    // Move to the next word
                    setIsDeleting(false)
                    setWordIndex((prev) => (prev + 1) % words.length)
                }
            },
            isDeleting ? deletingSpeed : typingSpeed,
        )

        return () => clearTimeout(timer)
    }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords])

    return (
        <span
            className={`inline-block ${className}`}
            style={{
                minWidth: containerWidth,
                textAlign: "left",
            }}
        >
            {text}
            <span className="opacity-0">.</span> {/* Invisible character to maintain height */}
        </span>
    )
}