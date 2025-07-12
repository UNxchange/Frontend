import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ConvocatoriasService } from '../services/convocatoriasService';
import { ApplicationDetails } from '../types';

interface StudentDataTableProps {
    applications?: ApplicationDetails[];
}

const StudentDataTable: React.FC<StudentDataTableProps> = ({ applications: externalApplications }) => {
    const [applications, setApplications] = useState<ApplicationDetails[]>([]);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        institution: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        country: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        agreementType: { value: null, matchMode: FilterMatchMode.EQUALS },
        state: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    useEffect(() => {
        if (externalApplications) {
            setApplications(externalApplications);
            setLoading(false);
        } else {
            ConvocatoriasService.getConvocatorias()
                .then((data: ApplicationDetails[]) => {
                    console.log('Convocatorias data:', data);
                    setApplications(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error loading convocatorias:', error);
                    setLoading(false);
                });
        }
    }, [externalApplications]);

    // Template para mostrar la institución con icono
    const institutionBodyTemplate = (rowData: ApplicationDetails) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-building" style={{ color: '#3b82f6' }}></i>
                <span>{rowData.institution}</span>
            </div>
        );
    };

    // Template para el país
    const countryBodyTemplate = (rowData: ApplicationDetails) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-globe" style={{ color: '#10b981' }}></i>
                <span>{rowData.country}</span>
            </div>
        );
    };

    // Template para el tipo de acuerdo
    const agreementTypeBodyTemplate = (rowData: ApplicationDetails) => {
        const getSeverity = (agreementType: string) => {
            switch (agreementType) {
                case 'Intercambio':
                    return 'info';
                case 'Marco+Intercambio':
                    return 'success';
                case 'Erasmus +':
                    return 'warning';
                default:
                    return 'secondary';
            }
        };

        return <Tag value={rowData.agreementType} severity={getSeverity(rowData.agreementType)} />;
    };

    // Template para el estado
    const stateBodyTemplate = (rowData: ApplicationDetails) => {
        const getSeverity = (state: string) => {
            switch (state) {
                case 'Vigente':
                    return 'success';
                case 'No Vigente':
                    return 'danger';
                default:
                    return 'secondary';
            }
        };

        return <Tag value={rowData.state} severity={getSeverity(rowData.state)} />;
    };

    // Template para idiomas
    const languagesBodyTemplate = (rowData: ApplicationDetails) => {
        return (
            <div className="flex gap-1 flex-wrap">
                {rowData.languages.map((language, index) => (
                    <Tag key={index} value={language} severity="info" style={{ fontSize: '0.75rem' }} />
                ))}
            </div>
        );
    };

    // Template para acciones
    const actionBodyTemplate = (rowData: ApplicationDetails) => {
        return (
            <div className="flex gap-2">
                {rowData.dreLink && (
                    <Button
                        icon="pi pi-file-pdf"
                        className="p-button-rounded p-button-text p-button-sm"
                        onClick={() => window.open(rowData.dreLink, '_blank')}
                        tooltip="Ver Convenio"
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
                {rowData.internationalLink && (
                    <Button
                        icon="pi pi-external-link"
                        className="p-button-rounded p-button-text p-button-sm"
                        onClick={() => window.open(rowData.internationalLink, '_blank')}
                        tooltip="Sitio Internacional"
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
                {rowData.agreementLink && (
                    <Button
                        icon="pi pi-info-circle"
                        className="p-button-rounded p-button-text p-button-sm"
                        onClick={() => window.open(rowData.agreementLink, '_blank')}
                        tooltip="Información Adicional"
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
            </div>
        );
    };

    // Template para el año de suscripción
    const subscriptionYearBodyTemplate = (rowData: ApplicationDetails) => {
        return <span style={{ fontWeight: 'bold', color: '#6366f1' }}>{rowData.subscriptionYear}</span>;
    };

    // Template para la validez
    const validityBodyTemplate = (rowData: ApplicationDetails) => {
        const isIndefinite = rowData.validity.toLowerCase().includes('indefinido');
        return (
            <span style={{ 
                color: isIndefinite ? '#10b981' : '#6b7280',
                fontWeight: isIndefinite ? 'bold' : 'normal'
            }}>
                {rowData.validity}
            </span>
        );
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        (_filters['global'] as any).value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h3 className="m-0">Convocatorias Disponibles</h3>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText 
                        value={globalFilterValue} 
                        onChange={onGlobalFilterChange} 
                        placeholder="Buscar convocatorias..." 
                    />
                </IconField>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable 
                value={applications} 
                paginator 
                rows={10} 
                dataKey="id" 
                filters={filters} 
                filterDisplay="menu" 
                loading={loading}
                globalFilterFields={['institution', 'country', 'agreementType', 'state', 'languages']} 
                header={header} 
                emptyMessage="No se encontraron convocatorias."
                showGridlines
                stripedRows
                responsiveLayout="scroll"
                breakpoint="960px"
            >
                <Column 
                    field="institution" 
                    header="Institución" 
                    body={institutionBodyTemplate}
                    sortable 
                    filter 
                    filterPlaceholder="Buscar institución"
                    style={{ minWidth: '250px' }}
                />
                <Column 
                    field="country" 
                    header="País" 
                    body={countryBodyTemplate}
                    sortable 
                    filter 
                    filterPlaceholder="Buscar país"
                    style={{ minWidth: '120px' }}
                />
                <Column 
                    field="agreementType" 
                    header="Tipo de Acuerdo" 
                    body={agreementTypeBodyTemplate}
                    sortable 
                    filter 
                    filterPlaceholder="Buscar tipo"
                    style={{ minWidth: '150px' }}
                />
                <Column 
                    field="state" 
                    header="Estado" 
                    body={stateBodyTemplate}
                    sortable 
                    filter 
                    filterPlaceholder="Buscar estado"
                    style={{ minWidth: '120px' }}
                />
                <Column 
                    field="subscriptionYear" 
                    header="Año" 
                    body={subscriptionYearBodyTemplate}
                    sortable 
                    style={{ minWidth: '80px' }}
                />
                <Column 
                    field="validity" 
                    header="Validez" 
                    body={validityBodyTemplate}
                    sortable 
                    style={{ minWidth: '120px' }}
                />
                <Column 
                    field="languages" 
                    header="Idiomas" 
                    body={languagesBodyTemplate}
                    style={{ minWidth: '150px' }}
                />
                <Column 
                    header="Acciones" 
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ minWidth: '120px' }}
                />
            </DataTable>
        </div>
    );
};

export default StudentDataTable;
