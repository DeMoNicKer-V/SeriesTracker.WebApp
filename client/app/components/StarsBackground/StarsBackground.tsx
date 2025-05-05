import React from "react";
import styles from "./component.module.css";

/**
 * @component StarsBackground
 * @description Компонент для отображения анимированного фона со звездами.
 * Создает эффект движущихся белых пикселей на заднем плане.
 * @returns {JSX.Element}
 */
const StarsBackground: React.FC = (): JSX.Element => {
    return (
        <div className={styles["background"]}>
            <div className={styles["stars"]}></div>
            <div className={styles["stars"]}></div>
            <div className={styles["stars"]}></div>
        </div>
    );
};

export default StarsBackground;
