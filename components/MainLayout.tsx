import {FC, ReactNode} from "react";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

type mainLayoutProps = {
    children: ReactNode,
}

const MainLayout: FC<mainLayoutProps> = ({children}) => (
    <>
        <MainHeader/>
        {children}
        <MainFooter/>
    </>
);

export default MainLayout;
