'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const STEPS = {
    DISCOVERY: 'discovery',
    SCALE: 'scale',
    LOCATION: 'location',
    LAND_AREA: 'land_area',
    SEGMENT: 'segment',
    WHATSAPP: 'whatsapp',
    EMAIL: 'email',
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
        { label: "Ultra Luxury", next: STEPS.WHATSAPP },
        { label: "Premium", next: STEPS.WHATSAPP },
        { label: "Budgetary", next: STEPS.WHATSAPP }
    ]
};

export default function FloatingCTA() {
    const ctaRef = useRef(null);
    const chatWindowRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(STEPS.DISCOVERY);
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Welcome. To help us understand your vision, what kind of space are you looking to craft?" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [userData, setUserData] = useState({
        type: '',
        scale: '',
        location: '',
        area: '',
        segment: '',
        whatsapp: '',
        email: ''
    });
    const [inputValue, setInputValue] = useState('');
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    useEffect(() => {
        gsap.fromTo(ctaRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 2 }
        );
    }, []);

    const toggleChat = () => {
        if (!isOpen) {
            setIsOpen(true);
            gsap.fromTo(chatWindowRef.current,
                { y: 50, opacity: 0, scale: 0.95, pointerEvents: 'none' },
                { y: 0, opacity: 1, scale: 1, pointerEvents: 'all', duration: 0.6, ease: 'power3.out' }
            );
        } else {
            gsap.to(chatWindowRef.current, {
                y: 20, opacity: 0, scale: 0.95, pointerEvents: 'none', duration: 0.4, ease: 'power3.in',
                onComplete: () => setIsOpen(false)
            });
        }
    };

    const addBotMessage = (text, delay = 1000) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text }]);
        }, delay);
    };

    const handleOptionSelect = (option) => {
        setMessages(prev => [...prev, { type: 'user', text: option.label }]);

        // Save choice
        if (currentStep === STEPS.DISCOVERY) setUserData(prev => ({ ...prev, type: option.label }));
        if (currentStep === STEPS.SCALE) setUserData(prev => ({ ...prev, scale: option.label }));
        if (currentStep === STEPS.SEGMENT) setUserData(prev => ({ ...prev, segment: option.label }));

        setCurrentStep(option.next);

        if (option.next === STEPS.SCALE) {
            addBotMessage("Exquisite choice. What is the approximate scale of this project?");
        } else if (option.next === STEPS.LOCATION) {
            addBotMessage("To visualize the context, where is the site located?");
        } else if (option.next === STEPS.WHATSAPP) {
            addBotMessage("Our lead architect would love to share some relevant portfolio pieces. May we have your WhatsApp number?");
        }
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const val = inputValue.trim();
        setMessages(prev => [...prev, { type: 'user', text: val }]);
        setInputValue('');

        if (currentStep === STEPS.LOCATION) {
            setUserData(prev => ({ ...prev, location: val }));
            setCurrentStep(STEPS.LAND_AREA);
            addBotMessage("What is the approximate land area in Square Feet?");
        } else if (currentStep === STEPS.LAND_AREA) {
            setUserData(prev => ({ ...prev, area: val }));
            setCurrentStep(STEPS.SEGMENT);
            addBotMessage("Which segment best describes your architectural ambition?");
        } else if (currentStep === STEPS.WHATSAPP) {
            setUserData(prev => ({ ...prev, whatsapp: val }));
            setCurrentStep(STEPS.EMAIL);
            addBotMessage("And your email address for us to send a detailed project brief?");
        } else if (currentStep === STEPS.EMAIL) {
            setUserData(prev => ({ ...prev, email: val }));
            setCurrentStep(STEPS.FINAL);
            addBotMessage("Thank you! Our studio will reach out to schedule an initial consultation soon.");
        }
    };

    const generateWhatsAppLink = () => {
        const base = "https://wa.me/+918015759988";
        const messageBody = [
            `Hello Cuts & Grooves Studio,`,
            ``,
            `PROJECT INQUIRY DETAILS:`,
            `Location: ${userData.location || 'N/A'}`,
            `Type: ${userData.type || 'N/A'}`,
            `Scale: ${userData.scale || 'N/A'}`,
            `Land Area: ${userData.area || 'N/A'} Sq. Ft.`,
            `Segment: ${userData.segment || 'N/A'}`,
            `Email: ${userData.email || 'N/A'}`
        ].join('\n');

        return `${base}?text=${encodeURIComponent(messageBody)}`;
    };

    return (
        <>
            <div ref={chatWindowRef} className="chat-window" style={{ opacity: 0, pointerEvents: 'none' }} data-lenis-prevent>
                <div className="chat-header">
                    <span className="chat-header-title">Groove Concierge</span>
                    <button onClick={toggleChat} className="chat-close" suppressHydrationWarning={true}>✕</button>
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
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-interactive-zone">
                    {!isTyping && (currentStep === STEPS.DISCOVERY || currentStep === STEPS.SCALE || currentStep === STEPS.SEGMENT) && (
                        <div className="chat-options">
                            <p className="options-label">Select Option:</p>
                            <div className="options-grid">
                                {OPTIONS[currentStep].map((opt, i) => (
                                    <button key={i} onClick={() => handleOptionSelect(opt)} className="option-chip" suppressHydrationWarning={true}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isTyping && (currentStep === STEPS.LOCATION || currentStep === STEPS.LAND_AREA || currentStep === STEPS.WHATSAPP || currentStep === STEPS.EMAIL) && (
                        <form onSubmit={handleInputSubmit} className="chat-input-form">
                            <input
                                type={currentStep === STEPS.EMAIL ? "email" : "text"}
                                placeholder={
                                    currentStep === STEPS.LOCATION ? "Enter Site Location" :
                                        currentStep === STEPS.LAND_AREA ? "Enter Area (Sq. Ft.)" :
                                            currentStep === STEPS.WHATSAPP ? "Enter WhatsApp Number" :
                                                "Enter Email Address"
                                }
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="chat-inline-input"
                                autoFocus
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

            <div
                ref={ctaRef}
                className={`floating-cta ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
            >
                <div className="cta-main">
                    <div className="cta-label">
                        <span className="cta-text">{isOpen ? 'CLOSE' : 'INQUIRE'}</span>
                    </div>
                </div>
                <div className="cta-groove"></div>
            </div>
        </>
    );
}
