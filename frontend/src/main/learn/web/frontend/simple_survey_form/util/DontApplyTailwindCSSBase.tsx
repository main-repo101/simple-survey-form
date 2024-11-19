// DontApplyTailwindCssBase.tsx
import * as React from "react";

import "@resource/css/layer-twcss.css";

interface DontApplyTailwindCssBaseProps {
    children: React.ReactNode;
}

const DontApplyTailwindCssBase: React.FC<DontApplyTailwindCssBaseProps>
    = (prop: DontApplyTailwindCssBaseProps) => {
        return (
            <div className="dont-apply-tailwind">
                {prop.children}
            </div>
        );
    };


// const DontApplyTailwindCssBase: React.FC<{children: React.ReactNode }> = ({ children }) => {
//   return (
//     <div className="dont-apply-tailwind">
//       {children}
//     </div>
//   );
// };


export default DontApplyTailwindCssBase;
