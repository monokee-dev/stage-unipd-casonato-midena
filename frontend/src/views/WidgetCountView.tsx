
import { Component, ReactNode } from 'react';
import { IconType } from 'react-icons/lib';
import { FaUserCheck } from 'react-icons/fa';

const WidgetCountView = ({ count, description, icon }: { count: string|undefined, description: string, icon: ReactNode|undefined }) => {
    return <div className="widget">
        <div className="widget-text">
            <h3>
                <span className="count">{count}</span>
            </h3>
            <p>{description}</p> 
        </div>
        <div className="widget-icon">
            {icon?icon:<FaUserCheck />}
        </div>
    </div>;
};


export default WidgetCountView;