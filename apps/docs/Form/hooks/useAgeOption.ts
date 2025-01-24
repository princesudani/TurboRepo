type AgeOption = { label: string, value: string}

export function useGetAgeGroupOptions() {
    const ageGroupOptions: AgeOption[] = [
      { label: "18-25", value: "18-25" },
      { label: "26-35", value: "26-35" },
    ];  

    return {ageGroupOptions};
  }
  