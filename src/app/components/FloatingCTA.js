'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const STEPS = {
    NAME: 'name',
    WHATSAPP: 'whatsapp',
    DISCOVERY: 'discovery',
    SCALE: 'scale',
    LOCATION: 'location',
    LAND_AREA: 'land_area',
    SEGMENT: 'segment',
    FINAL: 'final'
};

const OPTIONS = {
    [STEPS.DISCOVERY]: [
        { label: "Bespoke Residential", next: STEPS.SCALE },
        { label: "Commercial & Retail", next: STEPS.SCALE },
        { label: "Just Exploring", next: STEPS.LOCATION }
    ],
    [STEPS.SCALE]: [
        { label: "Villa / Bungalow", next: STEPS.LOCATION },
        { label: "Apartment", next: STEPS.LOCATION },
        { label: "Office / Retail", next: STEPS.LOCATION },
        { label: "Other", next: STEPS.LOCATION }
    ],
    [STEPS.SEGMENT]: [
        { label: "Ultra Luxury", next: STEPS.FINAL },
        { label: "Premium", next: STEPS.FINAL },
        { label: "Budgetary", next: STEPS.FINAL }
    ]
};

export default function FloatingCTA() {
    const ctaRef = useRef(null);
    const chatWindowRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(STEPS.NAME);
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Welcome to Cuts & Grooves Studio. May we have your name to begin?" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        whatsapp: '',
        type: '',
        scale: '',
        location: '',
        area: '',
        segment: ''
    });
    const [inputValue, setInputValue] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    // Auto-focus input when it appears
    useEffect(() => {
        if (isOpen && !isTyping && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, isTyping, currentStep]);

    useEffect(() => {
        gsap.fromTo(ctaRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 2 }
        );
    }, []);

    const toggleChat = () => {
        if (!isOpen) {
            setIsOpen(true);
            const tl = gsap.timeline();

            // Genie Reveal Effect
            tl.fromTo(chatWindowRef.current, {
                scale: 0,
                opacity: 0,
                x: 40,
                y: 40
            }, {
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            });

            // Staggered Editorial Reveal
            tl.from('.chat-message', {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power3.out'
            }, "-=0.4");
        } else {
            gsap.to(chatWindowRef.current, {
                scale: 0.5,
                opacity: 0,
                x: 20,
                y: 20,
                duration: 0.5,
                ease: 'power3.in',
                onComplete: () => setIsOpen(false)
            });
        }
    };

    const addBotMessage = (text, delay = 1000) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text }]);

            // Editorial entrance for bot
            setTimeout(() => {
                const newMsg = document.querySelector('.chat-message:last-child');
                if (newMsg) {
                    gsap.fromTo(newMsg,
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                    );
                }
            }, 0);
        }, delay);
    };

    const handleOptionSelect = (option) => {
        setMessages(prev => [...prev, { type: 'user', text: option.label }]);

        // Editorial entrance for user
        setTimeout(() => {
            const userMsg = document.querySelector('.chat-message.user:last-child');
            if (userMsg) {
                gsap.fromTo(userMsg,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                );
            }
        }, 0);

        // Save choice
        if (currentStep === STEPS.DISCOVERY) setUserData(prev => ({ ...prev, type: option.label }));
        if (currentStep === STEPS.SCALE) setUserData(prev => ({ ...prev, scale: option.label }));
        if (currentStep === STEPS.SEGMENT) setUserData(prev => ({ ...prev, segment: option.label }));

        setCurrentStep(option.next);

        if (option.next === STEPS.SCALE) {
            addBotMessage("Exquisite choice. What is the approximate scale of this project?");
        } else if (option.next === STEPS.LOCATION) {
            addBotMessage("To visualize the context, where is the site located?");
        } else if (option.next === STEPS.FINAL) {
            addBotMessage(`Thank you, ${userData.name || 'friend'}! Our studio will reach out to schedule an initial consultation soon.`);
        }
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const val = inputValue.trim();
        setMessages(prev => [...prev, { type: 'user', text: val }]);
        setInputValue('');

        // Entrance for user input message
        setTimeout(() => {
            const userMsg = document.querySelector('.chat-message.user:last-child');
            if (userMsg) {
                gsap.fromTo(userMsg,
                    { x: 15, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
                );
            }
        }, 0);

        if (currentStep === STEPS.NAME) {
            setUserData(prev => ({ ...prev, name: val }));
            setCurrentStep(STEPS.WHATSAPP);
            addBotMessage(`Pleasure to meet you, ${val}! May we have your WhatsApp number to share our portfolio?`);
        } else if (currentStep === STEPS.WHATSAPP) {
            setUserData(prev => ({ ...prev, whatsapp: val }));
            setCurrentStep(STEPS.DISCOVERY);
            addBotMessage("Thank you. To help us understand your vision, what kind of space are you looking to craft?");
        } else if (currentStep === STEPS.LOCATION) {
            setUserData(prev => ({ ...prev, location: val }));
            setCurrentStep(STEPS.LAND_AREA);
            addBotMessage("What is the approximate land area in Square Feet?");
        } else if (currentStep === STEPS.LAND_AREA) {
            setUserData(prev => ({ ...prev, area: val }));
            setCurrentStep(STEPS.SEGMENT);
            addBotMessage("Which segment best describes your architectural ambition?");
        }
    };

    const generateWhatsAppLink = () => {
        const base = "https://wa.me/+918015759988";
        const messageBody = [
            `Hello Cuts & Grooves Studio,`,
            ``,
            `PROJECT INQUIRY DETAILS:`,
            `Name: ${userData.name || 'N/A'}`,
            `WhatsApp: ${userData.whatsapp || 'N/A'}`,
            `Location: ${userData.location || 'N/A'}`,
            `Type: ${userData.type || 'N/A'}`,
            `Scale: ${userData.scale || 'N/A'}`,
            `Land Area: ${userData.area || 'N/A'} Sq. Ft.`,
            `Segment: ${userData.segment || 'N/A'}`
        ].join('\n');

        return `${base}?text=${encodeURIComponent(messageBody)}`;
    };

    return (
        <>
            <div ref={chatWindowRef} className="chat-window" style={{ opacity: 0, transform: 'translateX(20px)' }} data-lenis-prevent>
                <div className="chat-header">
                    <span className="chat-header-title">Inquiry</span>
                    <button onClick={toggleChat} className="chat-close" suppressHydrationWarning={true}>CLOSE</button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-message ${msg.type}`}>
                            <div className="chat-bubble">{msg.text}</div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chat-message bot">
                            <div className="chat-bubble typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}

                    {!isTyping && (currentStep === STEPS.DISCOVERY || currentStep === STEPS.SCALE || currentStep === STEPS.SEGMENT) && (
                        <div className="chat-options-container">
                            <div className="options-grid">
                                {OPTIONS[currentStep].map((opt, i) => (
                                    <button key={i} onClick={() => handleOptionSelect(opt)} className="option-chip" suppressHydrationWarning={true}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-interactive-zone">

                    {!isTyping && (currentStep === STEPS.NAME || currentStep === STEPS.LOCATION || currentStep === STEPS.LAND_AREA || currentStep === STEPS.WHATSAPP) && (
                        <form onSubmit={handleInputSubmit} className="chat-input-form">
                            <input
                                type="text"
                                placeholder={
                                    currentStep === STEPS.NAME ? "Enter Your Name" :
                                        currentStep === STEPS.LOCATION ? "Enter Site Location" :
                                            currentStep === STEPS.LAND_AREA ? "Enter Area (Sq. Ft.)" :
                                                "Enter WhatsApp Number"
                                }
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="chat-inline-input"
                                ref={inputRef}
                                suppressHydrationWarning={true}
                            />
                            <button type="submit" className="chat-input-submit" suppressHydrationWarning={true}>Send</button>
                        </form>
                    )}

                    {currentStep === STEPS.FINAL && !isTyping && (
                        <div className="chat-footer">
                            <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="chat-cta-btn">
                                Send To Architect/Engineer
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* WhatsApp Trigger */}
            <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-trigger"
                aria-label="Chat on WhatsApp"
            >
                <div className="whatsapp-label">
                    Talk to an Architect <span style={{ fontSize: '1.1rem' }}>⚡</span>
                </div>
                <div className="whatsapp-icon-wrapper">
                    <svg className="whatsapp-icon" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.006.332.013c.101.007.231-.038.361.273.13.311.448 1.092.487 1.173.04.08.067.173.014.281-.054.107-.08.173-.159.273s-.152.193-.217.25c-.065.057-.134.12-.058.25.076.13.335.553.72.894.495.438.912.574 1.041.639.13.065.206.054.283-.035.076-.089.325-.38.411-.51.087-.13.173-.108.297-.061.123.047.781.369.915.436.134.067.223.1.256.155.033.055.033.315-.111.72z" />
                    </svg>
                </div>
            </a>

            {/* Chatbot Trigger */}
            <div
                ref={ctaRef}
                className={`floating-cta ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
            >
                <div className="chat-cta-label">
                    Chat with us <span style={{ fontSize: '1.1rem' }}>👋</span>
                </div>
                <div className="chat-cta-icon">
                    {isOpen ? (
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                    )}
                </div>
            </div>
        </>
    );
}
