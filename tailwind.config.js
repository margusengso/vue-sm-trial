/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,ts,tsx,js,jsx}"],
    theme: {
        extend: {
            colors: {
                appbg: "#F5F6F8",
                topbar: "#006ADD",
                incoming: "#eef1f4",
                outgoing: "#CEF9F1",
                send: "#00CFB4",
            },
            boxShadow: {
                card: "0 2px 0 rgba(0,0,0,0.04)",
            },
            fontFamily: {
                roboto: ["Roboto", "ui-sans-serif", "system-ui"],
                lato: ["Lato", "ui-sans-serif", "system-ui"],
            },
        },
    },
    plugins: [],
};