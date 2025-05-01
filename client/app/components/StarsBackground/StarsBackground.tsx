import styles from "./component.module.css";

const StarsBackground = ({}) => {
    return (
        <div className={styles["background"]}>
            <div className={styles["stars"]}></div>
            <div className={styles["stars"]}></div>
            <div className={styles["stars"]}></div>
        </div>
    );
};

export default StarsBackground;
