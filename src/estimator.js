const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  let time;

  // challenge one
  impact.currentlyInfected = Math.trunc(data.reportedCases * 10);
  severeImpact.currentlyInfected = Math.trunc(data.reportedCases * 50);

  // period estimations
  if (data.periodType === 'days') time = 2 ** Math.trunc(data.timeToElapse / 3);
  else if (data.periodType === 'weeks') time = 2 ** Math.trunc((data.timeToElapse * 7) / 3);
  else if (data.periodType === 'months') time = 2 ** Math.trunc((data.timeToElapse * 30) / 3);

  impact.infectionsByRequestedTime = Math.trunc(impact.currentlyInfected * time);
  severeImpact.infectionsByRequestedTime = Math.trunc(severeImpact.currentlyInfected * time);

  // challenge two
  impact.severeCasesByRequestedTime = Math.trunc(0.15 * impact.infectionsByRequestedTime);
  severeImpact.severeCasesByRequestedTime = Math.trunc(0.15 * severeImpact.infectionsByRequestedTime);

  const bedAvailability = 0.35 * data.totalHospitalBeds;
  // eslint variable name length fix, guideline variables are extremely long
  const rqt = impact.severeCasesByRequestedTime;
  const sRqt = severeImpact.severeCasesByRequestedTime;
  impact.hospitalBedsByRequestedTime = Math.trunc(bedAvailability - rqt);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(bedAvailability - sRqt);

  // challenge three
  const icuSevere = 0.05 * severeImpact.infectionsByRequestedTime;
  const ventilators = 0.02 * severeImpact.infectionsByRequestedTime;

  impact.casesForICUByRequestedTime = Math.trunc(0.05 * impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = Math.trunc(icuSevere);
  impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * impact.infectionsByRequestedTime);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(ventilators);
  // eslint variable name length fix
  const pop = data.region.avgDailyIncomePopulation;
  const avg = data.region.avgDailyIncomeInUSD;

  if (data.periodType === 'days') time = data.timeToElapse;
  else if (data.periodType === 'weeks') time = data.timeToElapse * 7;
  else if (data.periodType === 'months') time = data.timeToElapse * 30;

  const cashFlow = pop * avg * time;
  impact.dollarsInFlight = (impact.infectionsByRequestedTime * cashFlow).toFixed(2);
  severeImpact.dollarsInFlight = (severeImpact.infectionsByRequestedTime * cashFlow).toFixed(2);

  return {
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
