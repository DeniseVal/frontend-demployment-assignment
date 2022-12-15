import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";

const Photos = () => {
	const [photos, setPhotos] = useState([]);
	const [sort, setSort] = useState("asc");
	const [submited, setSubmited] = useState("");
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const deletePhoto = async (id) => {
		// TODO: answer here
		try {
			await fetch(`https://gallery-app-server.vercel.app/photos/${id}`, {
				method: "DELETE",
			}).then(async (res) => {
				if (res.status === 404) {
					const err = await res.json();
					setError(err.error);
				} else {
					setPhotos((photos) => photos.filter((photo) => photo.id !== id));
				}
			});
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		setLoading(true);
		// TODO: answer here
		const getPhotos = async (sortData, searchData) => {
			try {
				let url = "https://gallery-app-server.vercel.app/photos/";
				if (!submited) {
					url = `${url}?_sort=id&_order=${sortData}`;
				} else {
					url = `${url}?_sort=id&_order=${sortData}&q=${searchData}`;
				}
				const response = await fetch(url).then((res) => res.json());

				const data = await response;
				console.log(data);
				setPhotos(data);
				setLoading(false);
			} catch (err) {
				setError(true);
			}
		};

		getPhotos(sort, submited);
	}, [sort, submited]);

	useEffect(() => {
		setLoading(true);
		// TODO: answer here
		const getPhotos = async () => {
			try {
				const response = await fetch("https://gallery-app-server.vercel.app/photos/").then(
					(res) => res.json()
				);

				const data = await response;
				setPhotos(data);
				setLoading(false);
			} catch (err) {
				setError(true);
			}
		};

		getPhotos();
	}, []);

	if (error)
		return (
			<h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
				Error!
			</h1>
		);

	return (
		<>
			<div className="container">
				<div className="options">
					<select
						onChange={(e) => setSort(e.target.value)}
						data-testid="sort"
						className="form-select"
						style={{}}
					>
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
					</select>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setSubmited(search);
						}}
					>
						<input
							type="text"
							data-testid="search"
							onChange={(e) => setSearch(e.target.value)}
							className="form-input"
						/>
						<input
							type="submit"
							value="Search"
							data-testid="submit"
							className="form-btn"
						/>
					</form>
				</div>
				<div className="content">
					{loading ? (
						<h1
							style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
						>
							Loading...
						</h1>
					) : (
						photos.map((photo) => {
							return (
								<Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />
							);
						})
					)}
				</div>
			</div>
		</>
	);
};

export default Photos;
