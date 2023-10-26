import React from 'react';

export type ButtonProps = {
   title: string;
   className?: string;
   React: any,
}
export const TestComponent = ({title, className = ''}: ButtonProps) => {
   const [state] = React.useState(title);
   const onShowAlert = () => {
       alert(new Date().toLocaleDateString())
   }
return (
       <button className={`my-awesome-component ${className}`} onClick={onShowAlert}>
       </button>
   )
}