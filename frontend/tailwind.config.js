/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        plugin(function({
            matchUtilities,
            theme
        }) {
            matchUtilities({
                'text-outline': (value) => ({
                    textShadow: `-${value} -${value} 0 black, ${value} -${value} 0 black, -${value} ${value} 0 black, ${value} ${value} 0 black`,
                }),
            }, {
                values: theme('spacing')
            });
        }),
    ],
    corePlugins: {
        //REM: Disabling Tailwind's base styles completely
        // preflight: false,
    },
}