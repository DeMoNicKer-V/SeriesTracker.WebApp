
import { SetStateAction, useEffect, useState } from "react";
import { SeriesReqruest } from "../services/series";
import { ConfigProvider, DatePicker, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface Props{
    mode: Mode;
    values: Series;
    isModalOpen: boolean;
    handleCancel: () => void;
    handleCreate: (request: SeriesReqruest) => void;
    handleUpdate: (id: string, request: SeriesReqruest) => void;
}

export enum Mode{
    Create,
    Edit,
}
export const CreateUpdateSeries = ({
    mode,
    values, 
    isModalOpen,
    handleCancel,
    handleCreate,
    handleUpdate,
}: Props) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [currentEpisode, setcurrentEpisode] = useState<number>(0);
    const [lastEpisode, setlastEpisode] = useState<number>(0);
    const [releaseDate, setReleaseDate] = useState<string>("");


useEffect(() =>{
    setTitle(values.title);
    setDescription(values.description);
    setlastEpisode(values.lastEpisode);
}, [values])

    const handleOnOk = async () => {
        const seriesRequest = {title, description, lastEpisode, currentEpisode, releaseDate};
        mode == Mode.Create ? handleCreate(seriesRequest): handleUpdate(values.id, seriesRequest);
    }

    return (
        <Modal
        title={
            mode == Mode.Create ? "Добавить сериал": "Редактировать сериал"
        }
        open={isModalOpen}
        onOk={handleOnOk}
        onCancel={handleCancel}
        cancelText={"Отмена"}>
            <div className="series_modal">
                <Input
                value={title}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setTitle(e.target.value)}
                placeholder={"Название"}/>

<TextArea
                value={description}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDescription(e.target.value)}
                autosize={{minRows: 3, maxRows: 3}}
                placeholder={"Описание"}/>

<Input
                value={currentEpisode}
                onChange={(e: { target: { value: any; }; }) => setcurrentEpisode(Number(e.target.value))}
                placeholder={"Уже просмотрено"}/>

<Input
                value={lastEpisode}
                onChange={(e: { target: { value: any; }; }) => setlastEpisode(Number(e.target.value))}
                placeholder={"Последний эпизод"}/>
                <ConfigProvider locale={locale}>
                <DatePicker  format="D MMMM YYYY" onChange={(date) => setReleaseDate(date.toString())} />
                </ConfigProvider>
            </div>
        </Modal>
    )
}