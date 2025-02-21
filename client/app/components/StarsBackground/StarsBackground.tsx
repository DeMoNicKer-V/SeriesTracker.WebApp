import styles from "./component.module.css";

const StarsBackground = ({}) => {
    /*  function createStyle(start: number) {
        let array: string[] = [];
        for (let index = 0; index < start; index++) {
            array[index] = `${Math.floor(Math.random() * 3500)}px ${Math.floor(
                Math.random() * 3500
            )}px #ffffff4d`;
        }
        return array.join(",");
    }*/

    return (
        <div className={styles["background"]}>
            <div className={styles["stars"]}></div>
            <div className={styles["stars"]}></div>
            <div className={styles["stars"]}></div>
        </div>
    );
};

export default StarsBackground;
