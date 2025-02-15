import React from 'react';
import {
    Skeleton,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import {
    Card,
    CardBody,
    CardHeader,
    Stack,
    StackItem,
    Bullseye,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    Title,
    TitleLevel,
    EmptyStateBody,
    Button
} from '@patternfly/react-core';

import { Report, ReportInitialSavingEstimation } from '../../../models';
import { formatValue } from '../../../Utilities/formatValue';
import { FancyGroupedBarChartData } from '../../../PresentationalComponents/FancyGroupedBarChart/FancyGroupedBarChart';

import Environment from '../../../PresentationalComponents/Reports/Environment';
import RenewalEstimation from '../../../PresentationalComponents/Reports/RenewalEstimation';
import FancyChartDonut from '../../../PresentationalComponents/FancyChartDonut';
import FancyGroupedBarChart from '../../../PresentationalComponents/FancyGroupedBarChart';
import ReportCard from '../../../PresentationalComponents/ReportCard';
import ProjectCostBreakdownTable from '../../../PresentationalComponents/Reports/ProjectCostBreakdownTable';
import './InitialSavingsEstimation.scss';
import {
    VMWARE_COLORR,
    RHVHYPERVISORS_COLOR,
    RHVGROWRTH_COLOR,
    RHTRAINING_COLOR,
    RHCONSULTING_COLOR,
    RHTRAVELANDLODGING_COLOR
} from '../../../Utilities/constants';
import { ObjectFetchStatus } from '../../../models/state';
import { ErrorCircleOIcon } from '@patternfly/react-icons';
import {
    ChartAxisProps,
    ChartLegendProps,
    ChartProps,
    ChartGroupProps,
    ChartBarProps
} from '@patternfly/react-charts';
import { FancyChartDonutData } from '../../../PresentationalComponents/FancyChartDonut/FancyChartDonut';

interface StateToProps {
    report: Report;
    reportInitialSavingEstimation: ReportInitialSavingEstimation;
    reportInitialSavingEstimationFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
    fetchReportInitialSavingEstimation: (reportId: number) => any;
}

interface Props extends StateToProps, DispatchToProps {
    reportId: number;
};

interface State {
};

const sumReducer = (a: number, b: number) => a + b;

class InitialSavingsEstimation extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public componentDidMount() {
        this.refreshData();
    }

    public refreshData = () => {
        const { reportId, fetchReportInitialSavingEstimation } = this.props;
        fetchReportInitialSavingEstimation(reportId);
    };

    public renderInfo = () => {
        const { report, reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard
                title={ `Initial Savings Estimation (${ report ? report.reportName : '' })` }
                headerClass="pf-m-2xl-override"
                bodyClass="pf-c-content no-margin-bottom"
                skipBullseye={ true }
            >
                <p>
                    <span>Source:</span>&nbsp;
                    <span>Vmware Vsphere Enterprise Plus</span><br />
                    <span>Target:</span>&nbsp;
                    <span>Red Hat Virtualization</span>
                </p>
                <p>
                    <span>Over 3 year(s) with Red Hat Virtualization, your initial savings estimation could be as much as</span>
                </p>
                <p className="pf-c-title pf-m-2xl pf-u-text-align-center stack-item-border">
                    <span>
                        { formatValue(reportInitialSavingEstimation.rhvSavingsModel.rhvSaveHighValue, 'usd', { fractionDigits: 0 }) }
                    </span>
                </p>
            </ReportCard>
        );
    }

    public renderCostExpenditureComparison = () => {
        const { reportInitialSavingEstimation } = this.props;
        const sourceRampDownCostsModel = reportInitialSavingEstimation.sourceRampDownCostsModel;
        const rhvRampUpCostsModel = reportInitialSavingEstimation.rhvRampUpCostsModel;

        // VMware values
        const vmwareCostsYear1 = sourceRampDownCostsModel.year1SourceMaintenanceTotalValue;
        const vmwareCostsYear2 = sourceRampDownCostsModel.year2SourceMaintenanceTotalValue;
        const vmwareCostsYear3 = sourceRampDownCostsModel.year3SourceMaintenanceTotalValue;

        // RHV values
        const rhvCostsYear1 = rhvRampUpCostsModel.year1RhvGrandTotalGrowthValue + rhvRampUpCostsModel.rhvSwitchLearningSubsValue;
        const rhvCostsYear2 = rhvRampUpCostsModel.year2RhvGrandTotalGrowthValue;
        const rhvCostsYear3 = rhvRampUpCostsModel.year3RhvGrandTotalGrowthValue;

        // Chart config
        const legendProps: ChartLegendProps = { height: 20, x: 130 };
        const chartProps: ChartProps = {
            width: 650,
            height: 300,
            domainPadding: {
                x: 110,
                y: 60
            },
            padding: { left: 150, right: 20, bottom: 30, top: 0 }
        };
        const chartGroupProps: ChartGroupProps = { offset: 50 };
        const chartBarProps: ChartBarProps = { barWidth: 50 };

        const barChartData: FancyGroupedBarChartData = {
            legends: [ 'VMware Costs', 'RHV Costs' ],
            colors: [ VMWARE_COLORR, RHVHYPERVISORS_COLOR ],
            values: [
                [
                    { x: '1', y: vmwareCostsYear1, label: formatValue(vmwareCostsYear1, 'usd', { fractionDigits: 0 }) },
                    { x: '2', y: vmwareCostsYear2, label: formatValue(vmwareCostsYear2, 'usd', { fractionDigits: 0 }) },
                    { x: '3', y: vmwareCostsYear3, label: formatValue(vmwareCostsYear3, 'usd', { fractionDigits: 0 }) }
                ],
                [
                    { x: '1', y: rhvCostsYear1, label: formatValue(rhvCostsYear1, 'usd', { fractionDigits: 0 }) },
                    { x: '2', y: rhvCostsYear2, label: formatValue(rhvCostsYear2, 'usd', { fractionDigits: 0 }) },
                    { x: '3', y: rhvCostsYear3, label: formatValue(rhvCostsYear3, 'usd', { fractionDigits: 0 }) }
                ]
            ]
        };

        const dependentChartAxisProps: ChartAxisProps = {
            tickFormat: (tick: any) =>  `${formatValue(tick, 'usd', { fractionDigits: 0 })}`
        };

        const footer = (
            <div className="pf-u-text-align-center">
                <span style={ { marginLeft: 130 } }>Year</span>
            </div>
        );

        return (
            <ReportCard
                title="Cost expenditure comparison during the 3 year migration"
            >
                <FancyGroupedBarChart
                    data={ barChartData }
                    legendProps={ legendProps }
                    chartProps={ chartProps }
                    chartGroupProps={ chartGroupProps }
                    chartBarProps={ chartBarProps }
                    dependentChartAxisProps={ dependentChartAxisProps }
                    footer={ footer }
                />
            </ReportCard>
        );
    };

    public renderEnvironment = () => {
        const { reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard title="Environment">
                <Environment data={ reportInitialSavingEstimation.environmentModel } />
            </ReportCard>
        );
    }

    public renderRenewalEstimation = () => {
        const { reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard title="VMware ELA renewal estimation">
                <RenewalEstimation data={ reportInitialSavingEstimation.sourceCostsModel } />
            </ReportCard>
        );
    }

    public renderTotalMaintenance = () => {
        const { reportInitialSavingEstimation } = this.props;

        const sourceRampDownCostsModel = reportInitialSavingEstimation.sourceRampDownCostsModel;
        const rhvRampUpCostsModel = reportInitialSavingEstimation.rhvRampUpCostsModel;

        const vmwareTotal = [
            sourceRampDownCostsModel.year1SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year2SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year3SourceMaintenanceTotalValue
        ].reduce(sumReducer, 0);

        const rhvHypervisorsTotal = [
            rhvRampUpCostsModel.year1RhvTotalValue,
            rhvRampUpCostsModel.year2RhvTotalValue,
            rhvRampUpCostsModel.year3RhvTotalValue
        ].reduce(sumReducer, 0);

        const rhvGrowthTotal = [
            (rhvRampUpCostsModel.year1RhvTotalGrowthValue || 0),
            (rhvRampUpCostsModel.year2RhvTotalGrowthValue || 0),
            (rhvRampUpCostsModel.year3RhvTotalGrowthValue || 0)
        ].reduce(sumReducer, 0);

        const rhTrainingTotal = rhvRampUpCostsModel.rhvSwitchLearningSubsValue;
        const rhConsultingTotal = rhvRampUpCostsModel.rhvSwitchConsultValue;
        const rhTravelAndLodgingTotal = rhvRampUpCostsModel.rhvSwitchTAndEValue;

        //
        const pieValues = [
            vmwareTotal,
            rhvHypervisorsTotal,
            rhvGrowthTotal,
            rhTrainingTotal,
            rhConsultingTotal,
            rhTravelAndLodgingTotal
        ];
        const total = pieValues.reduce(sumReducer, 0);
        const percentages = pieValues.map((val) => ((val / total) * 100));

        const chartProps = {
            title: formatValue(total, 'usd', { fractionDigits: 0 }),
            height: 300,
            width: 300
        };
        const chartLegendProps = {
            height: 300,
            width: 210,
            responsive: false,
            y: 60
        };

        const chartData: FancyChartDonutData[] = [
            { label: 'VMware', value: percentages[0], color: VMWARE_COLORR },
            { label: 'RHV Hypervisors', value: percentages[1], color: RHVHYPERVISORS_COLOR },
            { label: 'RHV Growth', value: percentages[2], color: RHVGROWRTH_COLOR },
            { label: 'Red Hat Training', value: percentages[3], color: RHTRAINING_COLOR },
            { label: 'Red Hat Consulting', value: percentages[4], color: RHCONSULTING_COLOR },
            { label: 'Travel and Lodging', value: percentages[5], color: RHTRAVELANDLODGING_COLOR }
        ];

        const tickFormat = (label: string, value: number) => `${label}: ${value.toFixed(2)}%`;
        return (
            <ReportCard
                title='Total VMware maintenance, Red Hat Virtualization, training and services costs during a 3 year migration)'
            >
                <FancyChartDonut
                    data={ chartData }
                    chartProps={ chartProps }
                    chartLegendProps={ chartLegendProps }
                    tickFormat={ tickFormat }
                />
            </ReportCard>
        );
    }

    public renderProjectCostBreakdown = () => {
        const { reportInitialSavingEstimation } = this.props;

        const sourceRampDownCostsModel = reportInitialSavingEstimation.sourceRampDownCostsModel;
        const rhvRampUpCostsModel = reportInitialSavingEstimation.rhvRampUpCostsModel;

        // Bar chart values
        const vmwareTotal = [
            sourceRampDownCostsModel.year1SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year2SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year3SourceMaintenanceTotalValue
        ].reduce(sumReducer, 0);

        const rhvHypervisorsTotal = [
            rhvRampUpCostsModel.year1RhvTotalValue,
            rhvRampUpCostsModel.year2RhvTotalValue,
            rhvRampUpCostsModel.year3RhvTotalValue
        ].reduce(sumReducer, 0);

        const rhvGrowthTotal = [
            rhvRampUpCostsModel.year1RhvTotalGrowthValue,
            rhvRampUpCostsModel.year2RhvTotalGrowthValue,
            rhvRampUpCostsModel.year3RhvTotalGrowthValue
        ].reduce(sumReducer, 0);

        const rhTrainingTotal = rhvRampUpCostsModel.rhvSwitchLearningSubsValue;
        const rhConsultingTotal = rhvRampUpCostsModel.rhvSwitchConsultValue;
        const rhTravelAndLodgingTotal = rhvRampUpCostsModel.rhvSwitchTAndEValue;

        // Chart config
        const chartProps: ChartProps = {
            width: 650,
            height: 350,
            domainPadding: {
                x: 50,
                y: 60
            },
            padding: { left: 150, right: 0, bottom: 100, top: 0 }
        };
        const chartGroupProps: ChartGroupProps = { offset: 0 };
        const chartBarProps: ChartBarProps = { barWidth: 50 };

        const barChartData: FancyGroupedBarChartData = {
            legends: undefined,
            colors: [ VMWARE_COLORR, RHVHYPERVISORS_COLOR, RHVGROWRTH_COLOR, RHTRAINING_COLOR, RHCONSULTING_COLOR, RHTRAVELANDLODGING_COLOR ],
            values: [
                [{ x: 'VMware', y: vmwareTotal, label: formatValue(vmwareTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'RVH Hypervisors', y: rhvHypervisorsTotal, label: formatValue(rhvHypervisorsTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'RHV Growth', y: rhvGrowthTotal, label: formatValue(rhvGrowthTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'Red Hat Training', y: rhTrainingTotal, label: formatValue(rhTrainingTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'Red Hat Consulting', y: rhConsultingTotal, label: formatValue(rhConsultingTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'Travel and lodging', y: rhTravelAndLodgingTotal, label: formatValue(rhTravelAndLodgingTotal, 'usd', { fractionDigits: 0 }) }]
            ]
        };

        const independentChartAxisProps: ChartAxisProps = {
            style: {
                tickLabels: {
                    angle: -45,
                    padding: 1,
                    textAnchor: 'end'
                }
            }
        };
        const dependentChartAxisProps: ChartAxisProps = {
            tickFormat: (tick: any) =>  `${formatValue(tick, 'usd', { fractionDigits: 0 })}`
        };

        const footer = (
            <div className="pf-u-text-align-center">
                <span style={ { marginLeft: 130 } }>Migration Cost Breakdown</span>
            </div>
        );

        return (
            <ReportCard
                title="Project cost breakdown"
            >
                <FancyGroupedBarChart
                    data={ barChartData }
                    chartProps={ chartProps }
                    chartGroupProps={ chartGroupProps }
                    chartBarProps={ chartBarProps }
                    independentChartAxisProps={ independentChartAxisProps }
                    dependentChartAxisProps={ dependentChartAxisProps }
                    footer={ footer }
                />
            </ReportCard>
        );
    }

    public renderProjectCostBreakdownTable = () => {
        const { reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard title="Project cost breakdown">
                <ProjectCostBreakdownTable
                    rhvRampUpCostsModel={ reportInitialSavingEstimation.rhvRampUpCostsModel }
                    sourceRampDownCostsModel={ reportInitialSavingEstimation.sourceRampDownCostsModel }
                />
            </ReportCard>
        );
    }

    public renderReports = () => {
        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        { this.renderInfo() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderCostExpenditureComparison() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderEnvironment() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderRenewalEstimation() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderTotalMaintenance() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderProjectCostBreakdown() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderProjectCostBreakdownTable() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card className="disclaimer">
                            <CardHeader>Disclaimer</CardHeader>
                            <CardBody>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                                    labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                    laboris nisi ut aliquip ex ea commodo consequat. Learn more about this in the documentation.
                                </p>
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    };

    public renderReportsSkeleton = () => {
        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                            skipBullseye={ true }
                        >
                            <Stack gutter="md">
                                <StackItem isFilled={ false }>
                                    <Skeleton size="sm" /><br />
                                    <Skeleton size="sm" style={ { height: '60px' } } /><br />
                                    <Skeleton size="sm" />
                                </StackItem>
                                <StackItem isFilled={ false } className="stack-item-border">
                                    <Skeleton size="lg"/>
                                </StackItem>
                            </Stack>
                        </ReportCard>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                        >
                            <Skeleton size="sm" style={ { height: '300px' } }/>
                        </ReportCard>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                        >
                            <SkeletonTable colSize={ 3 } rowSize={ 3 }/>
                        </ReportCard>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                        >
                            <SkeletonTable colSize={ 2 } rowSize={ 2 }/>
                        </ReportCard>
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    };

    public renderFetchError = () => {
        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.large }>
                    <EmptyStateIcon icon={ ErrorCircleOIcon } />
                    <Title headingLevel={ TitleLevel.h5 } size="lg">
                        Error
                    </Title>
                    <EmptyStateBody>
                        Something unexpected happend, please try again!
                    </EmptyStateBody>
                    <Button variant="primary" onClick={ this.refreshData }>Retry</Button>
                </EmptyState>
            </Bullseye>
        );
    };

    public render() {
        const { reportInitialSavingEstimation, reportInitialSavingEstimationFetchStatus } = this.props;

        const isFetchComplete: boolean = reportInitialSavingEstimationFetchStatus.status === 'complete';

        if (reportInitialSavingEstimationFetchStatus.error || (isFetchComplete && !reportInitialSavingEstimation)) {
            return this.renderFetchError();
        }

        return (
            <React.Fragment>
                { isFetchComplete ? this.renderReports() : this.renderReportsSkeleton() }
            </React.Fragment>
        );
    }
}

export default InitialSavingsEstimation;
