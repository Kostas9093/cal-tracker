export function calculateMaintenance(user) {
  if (
    !user ||
    typeof user.weight !== 'number' ||
    typeof user.height !== 'number' ||
    typeof user.age !== 'number' ||
    !user.gender ||
    !user.activity
  ) {
    console.warn('calculateMaintenance received invalid user:', user, new Error().stack);
    return NaN;
  }

  const { weight, height, age, gender, activity } = user;

  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const multiplier = activityMultipliers[activity] || 1.2;

  return Math.round(bmr * multiplier);
}

export function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}
