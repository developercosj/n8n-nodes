// 각 노드는 base file을 모두 가지고 있으며 하나의 파일에 노드의 모든 기능을 넣게 된다. 
// splitting out 
// node to access two of NASA's API endpoints: planetary/apod and mars-photos
// In a declarative-style node, the operations object includes routing [within the options array]
// This sets up the details of the API call 

// execute() method 
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

// INodeType 를 implement 해서 Node 생성 

export class NasaPics implements INodeType {

	description: INodeTypeDescription = {
          displayName: 'NASA Pics', 
          name: 'nasaPics', 
          icon: 'file:nasapics.svg', 
          group: ['transform'], 
          version: 1,
          subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',  
          description : 'Get data from NASAs API',
          defaults: {
            name: 'NASA Pics', 
          },
          inputs: ['main'],
          outputs: ['main'], 
          credentials: [
            {
                name: 'NasaPicsApi', 
                required: true, 
            }
          ], 
          requestDefaults: {
            baseURL: 'https://api.nasa.gov',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',  
            } 
          }, 
		properties: [
            {
                displayName: 'Resource',
                name: 'resource', 
                type: 'options', // controls which UI element n8n displays for the resource 
                noDataExpression: true,
                options: [
                    {
                        name: 'Astronomy Picture of the Day',
                        value: 'astronomyPictureOfTheDay',  

                    }, 
                    {
                        name: 'Mars Rover Photos',
                        value: 'marsRoverPhotos',  
                    },
                ], 
                default: 'astronomyPictureOfTheDay',  
            },
            {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: [
				'astronomyPictureOfTheDay',
			],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'get',
			action: 'Get the APOD',
			description: 'Get the Astronomy Picture of the day',
			routing: {
				request: {
					method: 'GET',
					url: '/planetary/apod',
				},
			},
		},
	],
	default: 'get',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: [
				'marsRoverPhotos',
			],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'get',
			action: 'Get Mars Rover photos',
			description: 'Get photos from the Mars Rover',
			routing: {
				request: {
					method: 'GET',
				},
			},
		},
	],
	default: 'get',
},
{
	displayName: 'Rover name',
	description: 'Choose which Mars Rover to get a photo from',
	required: true,
	name: 'roverName',
	type: 'options',
	options: [
		{name: 'Curiosity', value: 'curiosity'},
		{name: 'Opportunity', value: 'opportunity'},
		{name: 'Perseverance', value: 'perseverance'},
		{name: 'Spirit', value: 'spirit'},
	],
	routing: {
		request: {
			url: '=/mars-photos/api/v1/rovers/{{$value}}/photos',
		},
	},
	default: 'curiosity',
	displayOptions: {
		show: {
			resource: [
				'marsRoverPhotos',
			],
		},
	},
},
{
	displayName: 'Date',
	description: 'Earth date',
	required: true,
	name: 'marsRoverDate',
	type: 'dateTime',
	default:'',
	displayOptions: {
		show: {
			resource: [
				'marsRoverPhotos',
			],
		},
	},
	routing: {
		request: {
			// You've already set up the URL. qs appends the value of the field as a query string
			qs: {
				earth_date: '={{ new Date($value).toISOString().substr(0,10) }}',
			},
		},
	},
},
// Optional/additional fields will go here 

{
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	default: {},
	placeholder: 'Add Field',
	displayOptions: {
		show: {
			resource: [
				'astronomyPictureOfTheDay',
			],
			operation: [
				'get',
			],
		},
	},
	options: [
		{
			displayName: 'Date',
			name: 'apodDate',
			type: 'dateTime',
			default: '',
			routing: {
				request: {
					// You've already set up the URL. qs appends the value of the field as a query string
					qs: {
						date: '={{ new Date($value).toISOString().substr(0,10) }}',
					},
				},
			},
		},
	],									
}





		]
	};
}