import moment, { Moment } from 'moment';
import * as React from 'react';
import { innerDateFormat, TaskMapable } from '../../../utils/tasks';
import { TaskListContext } from './context';
import { DateView } from './dateview';

const defaultYearViewProps = {
    year: 2023 as number,
};
type YearViewProps = Readonly<typeof defaultYearViewProps>;
export class YearView extends React.Component<YearViewProps> {
    render(): React.ReactNode {
        return (
            <TaskListContext.Consumer>{({ taskList }) => {
                const tasksOfThisYear = taskList;
                const daysOfThisYear: Set<string> = new Set();
                tasksOfThisYear.forEach((t) => {
                    t.due && daysOfThisYear.add(t.due.format(innerDateFormat));
                    t.scheduled && daysOfThisYear.add(t.scheduled.format(innerDateFormat));
                    t.created && daysOfThisYear.add(t.created.format(innerDateFormat));
                    t.start && daysOfThisYear.add(t.start.format(innerDateFormat));
                    t.completion && daysOfThisYear.add(t.completion.format(innerDateFormat));
                    t.dates.forEach((d: Moment, k: string) => {
                        daysOfThisYear.add(d.format(innerDateFormat));
                    });
                })
                if (this.props.year === moment().year()) {
                    /**
                     * Today is promised to be in the date list
                     */
                    daysOfThisYear.add(moment().format(innerDateFormat));
                }
                return (
                    <div>
                        <YearHeader year={this.props.year} dataTypes={[...new Set(tasksOfThisYear.map(t => t.status))]} />
                        {[...daysOfThisYear].sort().map((d, i) => {
                            const tasksOfThisDate = tasksOfThisYear.filter(TaskMapable.filterDate(moment(d)));
                            return (
                                <TaskListContext.Provider value={{ taskList: tasksOfThisDate }} key={i}>
                                    <DateView date={moment(d)} key={i} />
                                </TaskListContext.Provider>
                            )
                        })}
                    </div>)
            }}
            </TaskListContext.Consumer>
        );
    }
}

const defaultYearHeaderProps = {
    year: 2023 as number,
    dataTypes: [] as string[],
}
type YearHeaderProps = Readonly<typeof defaultYearHeaderProps>;
class YearHeader extends React.Component<YearHeaderProps> {
    render(): React.ReactNode {
        const yearMoment = moment().year(this.props.year);
        return (
            <div className={"year" + (yearMoment.isSame(moment(), 'year') ? " current" : "")}
                data-types={this.props.dataTypes.join(" ")}>
                {yearMoment.format("YYYY")}
            </div>
        );
    }
}