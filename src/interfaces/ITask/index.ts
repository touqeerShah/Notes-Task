
export interface ITask {
    _id:string
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    dueDate?: Date;
    createdBy:string;
    createdAt?: Date;
    updatedAt?: Date;

}


export interface IDelete {

    acknowledged: boolean,
    deletedCount: number
}

export interface IGetAllPagination extends  ITask {
    startDate:Date |undefined,
    endDate:Date |undefined
    pageNo: number,
    pageLimit: number
}
export interface IReturn {
    results?: ITask | ITask[] | undefined;
    error: boolean;
    message: string;
    totalRecord?: number;
    pageTotal?:number;
    currentPage?:number
    deleteResult?: IDelete
}

export interface IQuery  {
    _id:string;
    createdBy: string;
    status: 'pending' | 'in-progress' | 'completed';;
  }