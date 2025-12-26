export const employeeListFFT=[
    
    {
    name:"Dr. N.K. Singh",
    designation:"",
    id:1
},
    {
    name:"Dr. K.K. Singh",
    designation:"",
    id:2
},
    {
    name:"Dr. R.K. Odhar",
    designation:"",
    id:3
},
    {
    name:"Dr. Nandita Gupta",
    designation:"",
    id:4
},
    {
    name:"Dr. Manoj Kumar",
    designation:"",
    id:5
},
    {
    name:"Dr. Amitesh Kumar",
    designation:"",
    id:6
},
    {
    name:"Dr. Ajit Kr Pramanick",
    designation:"",
    id:7
},
    {
    name:"Dr. Vineet Chak",
    designation:"",
    id:8
},
    {
    name:"Dr. Deepak Kumar",
    designation:"",
    id:9
},
    {
    name:"Dr. Himanshu Khandelwal",
    designation:"",
    id:10
},
    {
    name:"Dr. R. Rahul Kulkarni",
    designation:"",
    id:11
},
    {
    name:"Dr. Vivek S Ayar",
    designation:"",
    id:12
},
    {
    name:"Dr. E. Hemachandran",
    designation:"",
    id:13
},
    {
    name:"Dr. Sunny Singhania",
    designation:"",
    id:14
},
    {
    name:"Dr. Anas Ahmad Siddique",
    designation:"",
    id:15
},
    {
    name:"Dr. Pavitra Singh",
    designation:"",
    id:16
},
//     {
//     name:"Dr. Rajat Upadhayay",
//     designation:"",
//     id:17
// },
//     {
//     name:"DASH Department",
//     designation:"",
//     other:true,
//     id:18
// },
//     {
//     name:"Electronics & Computer Department",
//     designation:"",
//     other:true,
//     id:19
// },
//     {
//     name:"Gymkhana Chairman",
//     designation:"",
//     other:true,
//     id:20
// },

//     {
//     name:"Shankar Behera",
//     designation:"",
//     id:17
// },
//     {
//     name:"Chandan Kumar",
//     designation:"",
//     id:18
// },
//     {
//     name:"Pran Kumar",
//     designation:"",
//     id:19
// },
//     {
//     name:"Raju Ram",
//     designation:"",
//     id:20
// },
//     {
//     name:"Jitray Munda",
//     designation:"",
//     id:21
// },
//     {
//     name:"Munna Prasad",
//     designation:"",
//     id:22
// },
//     {
//     name:"Rahul kumar",
//     designation:"",
//     id:23
// },
//     {
//     name:"Md. Firoz",
//     designation:"",
//     id:24
// },
//     {
//     name:"Divesher Mukhiyar",
//     designation:"",
//     id:25
// },
//     {
//     name:"Vishal Kumar",
//     designation:"",
//     id:26
// },


]




export function getEmployeeName(id:number){
     const foundIndex= employeeListFFT.findIndex(res=> res.id==id);
     if(foundIndex>-1){
         return employeeListFFT[foundIndex].name;
     }else{
         return ""
     }
}


export interface ILEmployee {
    id: number;
    name: string;
    position: string;
    department: string;
    joinDate: Date;
    avatar?: string;
    leaveBalances: {
      casualLeave: number;
      sickLeave: number;
      earnedLeave: number;
      otherLeave: number;
    };
  }

  export interface ILLeave {
    id: number;
    employeeId: number;
    employeeName: string;
    type: 'Casual' | 'Sick' | 'Earned' | 'Other';
    startDate: Date;
    endDate: Date;
    status: 'Pending' | 'Approved' | 'Rejected';
    reason: string;
  }