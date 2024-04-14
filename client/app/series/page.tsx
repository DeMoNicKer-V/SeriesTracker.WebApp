"use client";
import Button from "antd/es/button"
import { Series } from "../components/Series";
import { useEffect, useState } from "react";
import { SeriesReqruest, createSeries, deleteSeries, getAllSeries, updateSeries } from "../services/series";
import Title from "antd/es/skeleton/Title";
import { CreateUpdateSeries, Mode } from "../components/AddUpdateSeries";
import { create } from "domain";

export default function SeriesPage(){

    const defaultValues = {title: "",
    description: "",
    lastEpisode: 1,
} as Series;

    const [values, setValues] = useState<Series>(defaultValues);

    useEffect(() => {
        const getSeries = async() =>{
            const series = await getAllSeries();
            setLoading(false);
            setSeries(series);
        }
        getSeries();
    }, []);

    const [series, setSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Mode.Create);


    const handleCreateSeries = async (request: SeriesReqruest) =>{
        await createSeries(request);
        closeModal();

        const series = await getAllSeries();
        setSeries(series);
    }

    const handleUpdateSeries = async (id: string, request: SeriesReqruest) =>{
        await updateSeries(id, request);
        closeModal();

        const series = await getAllSeries();
        setSeries(series);
    }

    const deleteThisSeries = async (id: string) =>{
        await deleteSeries(id);
        closeModal();

        const series = await getAllSeries();
        setSeries(series);
    }

    const openEditModel = (series: Series) =>{
        setMode(Mode.Edit);
        setValues(series);
        setIsModalOpen(true);
    }

    const openModal = () =>{
        setIsModalOpen(true);
    }

    const closeModal = () =>{
        setValues(defaultValues);
        setIsModalOpen(false);
    }


    return(
        <div>
            <Button type="primary" style={{marginTop: "30px"}} size="large" onClick={openModal}>Добавить сериал</Button>
            
            <CreateUpdateSeries
                mode={mode}
                values={values}
                isModalOpen={isModalOpen}
                handleCreate={handleCreateSeries}
                handleUpdate={handleUpdateSeries}
                handleCancel={closeModal}
            />

{loading ? <Title>Loading...</Title> : <Series series={series} handleOpen={openEditModel} handleDelete={deleteThisSeries}/>}
        </div>
    )
}   