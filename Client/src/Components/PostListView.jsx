import React, { useState } from 'react';
import PopUpModal from './PopUpModal';
import ViewPostContent from './ViewPostContent';
import ChangePostForm from './ChangePostForm';
import '../Styles/PostListView.css';

export default function PostListView({ post, user, deleteService, updateServices, categoryList, services}) {
	let title = post.title;
	const editSubmitButton = (
		<input type="submit" id="createButton" value="Update" />
	);

	const [updateModalIsOpen, setEditModalIsOpen] = useState(false);
	const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

	function checkServiceId(services)
	{
		return services._id != post._id;
	}

	const deleteContent = (
		<React.Fragment>
			<div id="container">
				<span id="deleteTextFormat">
					This action will delete {title} permanentanly and cannot be undone.
				</span>
				<button
					id="cancelButton"
					className="floatLeft"
					onClick={() => setDeleteModalIsOpen(false)}
				>
					Cancel
				</button>
				<button
					id="deleteButton"
					className="floatRight"
					onClick={async (e) => {
						e.preventDefault();
						deleteService(post._id);
						var categories = post.categories;
						var serviceId = post._id;

						//This needs to be commented back in when the api to remove a service from a user is setup.
						// const serviceUser = await fetch('http://localhost:3001/api/users/'+user._id+"/remove-service/"+serviceId, {
						// 	method: 'DELETE',
						// });
							
						// const userData = await serviceUser.json();
						// console.log(userData.message);
						
						for(var i = 0; i < categories.length; i++)
						{
							console.log(categories[i])
							const serviceCategory = await fetch('http://localhost:3001/api/categories/'+categories[i]+"/remove-service/"+serviceId, {
								method: 'DELETE',
							});
								
							const categoryData = await serviceCategory.json();
							console.log(categoryData.message);
						}

						updateServices(services => services.filter(checkServiceId));
						setDeleteModalIsOpen(false);
					}}
				>
					Delete
				</button>
			</div>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			<div className="postBackground">
				<button
					className="floatLeft"
					id="edit"
					onClick={() => setEditModalIsOpen(true)}
				>
					<i className="fa fa-pencil" />
				</button>

				{/*add onclick to view post info*/}
				<div
					className="mainPostContent"
					onClick={() => setViewModalIsOpen(true)}
				>
					<img src={post.pinImg} />
					<div id="description">
						<h3>{title}</h3>
						<p>{post.description}</p>
					</div>
				</div>

				<button
					className="floatRight delete"
					onClick={() => setDeleteModalIsOpen(true)}
				>
					<i className="fa fa-trash-o" />
				</button>
			</div>

			<PopUpModal
				title="Edit post"
				isOpen={updateModalIsOpen}
				updateIsOpen={setEditModalIsOpen}
				content={<ChangePostForm post={post} categoryList={categoryList} services={services} updateIsOpen={setEditModalIsOpen}/>}
			/>
			<PopUpModal
				title={title}
				isOpen={viewModalIsOpen}
				updateIsOpen={setViewModalIsOpen}
				content={<ViewPostContent post={post} user={user}/>}
			/>
			<PopUpModal
				title={'Are you sure you want to delete ' + title + '?'}
				isOpen={deleteModalIsOpen}
				updateIsOpen={setDeleteModalIsOpen}
				content={deleteContent}
			/>
		</React.Fragment>
	);
}