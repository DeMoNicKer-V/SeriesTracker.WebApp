export const StarsBackground = ({}) => {
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
        <div className="background" style={{ zIndex: 1 }}>
            <div className="stars"></div>
            <div className="stars"></div>
            <div className="stars"></div>
        </div>
    );
};
