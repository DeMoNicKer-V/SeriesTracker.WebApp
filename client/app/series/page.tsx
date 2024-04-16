"use client";
import Button from "antd/es/button"
import { Series } from "../components/Series";
import { useEffect, useState } from "react";
import { SeriesReqruest, createSeries, deleteSeries, getAllSeries, getAllSeriesCount, updateSeries } from "../services/series";
import Title from "antd/es/skeleton/Title";
import { CreateUpdateSeries, Mode } from "../components/AddUpdateSeries";
import { Pagination } from "antd";

export default function SeriesPage(){

    const defaultValues = {title: "",
    description: "",
    lastEpisode: 1,
} as Series;

    const [values, setValues] = useState<Series>(defaultValues);


    useEffect(() => {
        const getSeries = async() =>{
            const series = await getAllSeries(page);
            const count = await getAllSeriesCount();
            setLoading(false);
            setseriesCount(count);
            setSeries(series);
        }
        getSeries();
    }, []);

    const [page, setPage] = useState<number>(1);
    const [seriesCount, setseriesCount] = useState<number>(1);
    const [series, setSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Mode.Create);


    const handleCreateSeries = async (request: SeriesReqruest) =>{
        await createSeries(request);
        closeModal();

        const series = await getAllSeries(page);
        setSeries(series);
    }

    const updateSeriesList = async (page:number) =>{

        const series = await getAllSeries(page);
        setSeries(series);
    }

    const handleUpdateSeries = async (id: string, request: SeriesReqruest) =>{
        await updateSeries(id, request);
        closeModal();

        const series = await getAllSeries(page);
        setSeries(series);
    }

    const deleteThisSeries = async (id: string) =>{
        await deleteSeries(id);
        closeModal();

        const series = await getAllSeries(page);
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
<Pagination  current={page}  onChange={(current: any) => {
                            setPage(current); updateSeriesList(current)}} showTitle={false} pageSize={16} total={seriesCount}/>
        </div>
    )
}   