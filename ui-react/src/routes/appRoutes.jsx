import Registration from "../views/Registration";
import Login from "../views/Login";
import EmployeeDashboard from "../views/EmployeeDashboard";
import NursingHomeDashboard from "../views/NursingHomeDashboard";
import RelativeDashboard from "../views/RelativeDashboard";
import PatientDashboard from "../views/PatientDashboard";

const appRoutes = [
  { path: "/login", name: "login", title: "Login", component: Login },
  {
    path: "/registration",
    name: "registration",
    title: "Connected Nursing Home",
    component: Registration
  },
  {
    path: "/edashboard",
    name: "edashboard",
    title: "Connected Nursing Home",
    component: EmployeeDashboard
  },
  {
    path: "/nhdashboard",
    name: "nhdashboard",
    title: "Connected Nursing Home",
    component: NursingHomeDashboard
  },
  {
    path: "/rdashboard",
    name: "rdashboard",
    title: "Connected Nursing Home",
    component: RelativeDashboard
  },
  {
    path: "/pdashboard",
    name: "pdashboard",
    title: "Connected Nursing Home",
    component: PatientDashboard
  }
];

export default appRoutes;
