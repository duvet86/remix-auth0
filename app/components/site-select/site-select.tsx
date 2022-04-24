export default function SiteSelect() {
  return (
    <div className="flex justify-center">
      <div className="mb-3 xl:w-96">
        <select
          className="form-select m-0
        block
        w-full
        appearance-none
        rounded
        border
        border-solid
        border-gray-300
        bg-white bg-clip-padding bg-no-repeat
        px-3 py-1.5 text-base
        font-normal
        text-gray-700
        transition
        ease-in-out
        focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
          aria-label="Default select example"
        >
          <option selected>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
    </div>
  );
}
