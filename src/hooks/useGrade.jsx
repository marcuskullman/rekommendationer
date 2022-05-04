const stdCities = require("../cities.json")

export const useGrade = ({ candidates }) =>
  candidates.reduce((result, candidate) => {
    const { createdDate, company, city, position, url, bio } = candidate

    // Calculate grade (data quality) using WEIGHTED average
    let totalSumOfWeightingFactor = 0
    let numberXWeightingFactor = 0
    let weight

    const add = value => {
      numberXWeightingFactor += value * weight
      totalSumOfWeightingFactor += weight
    }

    // First factor "Time": The older the data, the less relevant
    // To reflect the stats. According to SCB (2018) every second swede gets a new job within a five year period
    weight = 5

    const maxDays = 5 * 365
    const ageInDays = Math.round((+new Date() - (createdDate || 0)) / 864000)
    const notTooOld = Math.max(maxDays - ageInDays, 0)
    const agePercentage = 100 - notTooOld / maxDays

    add(agePercentage)

    // Second factor "Space": More data equals stronger profile
    // Weight by how many external candidates since internal has all this info
    weight = 5

    let registryPercentage = 0

    if (company) registryPercentage += 20
    if (city) registryPercentage += 20
    if (position) registryPercentage += 20
    if (url) registryPercentage += 20
    if (bio) registryPercentage += 20

    add(registryPercentage)

    // Third factor "Force": Stadardized data = better quality
    weight = 2

    let standardizedPercentage = 0

    if (stdCities.includes(city?.value)) standardizedPercentage += 50
    if ([].includes(position?.value)) standardizedPercentage += 50 // No standard positions provided...

    add(standardizedPercentage)

    // Weighted average
    const grade =
      Math.round((numberXWeightingFactor / totalSumOfWeightingFactor) * 1e2) /
      1e2

    // If grade/quality is too bad, do not include
    // (80/20 pereto distribution)
    if (grade > 20) {
      result.push({ ...candidate, grade })
    }

    return result
  }, [])
