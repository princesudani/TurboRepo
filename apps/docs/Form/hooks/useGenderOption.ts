type GenderOption = { label: string, value: string }

export function useGetGenderOptions() {
    const genderOptions: GenderOption[] = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Others", value: "others" },
      ]

      return { genderOptions }
}