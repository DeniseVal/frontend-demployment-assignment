import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPhoto = () => {
	const [imageUrl, setImageUrl] = useState("");
	const [captions, setCaptions] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { id } = useParams();

	const editPhoto = async (e) => {
		e.preventDefault();
		// TODO: answer here
		try {
			await fetch(`https://gallery-app-server.vercel.app/photos/${id}`, {
				headers: {
					"Content-Type": "application/json",
				},
				method: "PATCH",
				body: JSON.stringify({
					imageUrl: imageUrl,
					captions: captions,
					updatedAt: Date.now(),
				}),
			}).then(async (res) => {
				if (res.status === 403) {
					const err = await res.json();
					setError(err.error);
				} else {
					navigate(`/photos`);
				}
			})			
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		setLoading(true);
		// TODO: answer here
		const getPhoto = async (id) => {
			try {
				const response = await fetch(`https://gallery-app-server.vercel.app/photos/${id}`).then(
					(res) => res.json()
				);

				const data = await response;
				setCaptions(data.captions);
				setImageUrl(data.imageUrl);
				setLoading(false);
			} catch (err) {
				setError(true);
			}
		};

		getPhoto(id);
	}, [id]);

	if (error) return <div>Error!</div>;

	return (
		<>
			{loading ? (
				<h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
					Loading...
				</h1>
			) : (
				<div className="container">
					<form className="edit-form" onSubmit={editPhoto}>
						<label>
							Image Url:
							<input
								className="edit-input"
								type="text"
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
							/>
						</label>
						<label>
							Captions:
							<input
								className="edit-input"
								type="text"
								value={captions}
								data-testid="captions"
								onChange={(e) => setCaptions(e.target.value)}
							/>
						</label>
						<input
							className="submit-btn"
							type="submit"
							value="Submit"
							data-testid="submit"
						/>
					</form>
				</div>
			)}
		</>
	);
};

export default EditPhoto;
